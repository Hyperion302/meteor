import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as uuid from 'uuid/v4';
import { IVideo, ILog, IChannel } from './definitions';
import * as path from 'path';
import { Logging, Log } from '@google-cloud/logging';
import * as axios from 'axios';

// Initialize various SDKs
admin.initializeApp(functions.config().firebase);
const db = admin.firestore();
const logging = new Logging();
const log = logging.log('functions-log');


async function addLog(logRef: Log, functionName: string, data: ILog) {
    /*const metadata = {
        resource: {
            type: 'cloud_function',
            labels: {
                function_name: functionName,
                region: 'us-central1'
            }
        }
    };
    const entry = logRef.entry(metadata, data);
    await logRef.write(entry);
    */
    console.log(data.message);
}

exports.createVideo = functions.https.onCall(async (data, context) => {
    // Check auth
    if(!context.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated to make this request');
    }
    // Get Title
    const title = data.title;
    if(!(typeof title === 'string') || title.length === 0) {
        throw new functions.https.HttpsError('invalid-argument', 'Invalid title');
    }
    // Check channel existence
    const channelId = data.channel;
    if(!(typeof channelId === 'string') || channelId.length === 0) {
        throw new functions.https.HttpsError('invalid-argument', 'Invalid title');
    }
    const channelDoc = db.doc(`channels/${channelId}`);
    const channelSnap = await channelDoc.get();
    if(!channelSnap.exists) {
        throw new functions.https.HttpsError('invalid-argument', 'Channel does not exist');
    }
    // TODO: Better keys
    const keywords = title.split(' ');
    // Create video
    const userId = context.auth.uid;
    const videoId = uuid();
    const video: IVideo = {
        id: videoId,
        author: userId,
        channel: channelId,
        title: title,
        titleKeys: keywords,
        status: 'master-upload-ready'
    };
    const doc = db.doc(`videos/${videoId}`);
    await doc.set(video);
    await addLog(log, 'createVideo', {
        eventSource: 'video',
        value: video,
        message: `Video ${videoId} : ${title} created in DB`
    });
    return video;
});

exports.createChannel = functions.https.onCall(async (data, context) => {
    if(!context.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated to make this request');
    }
    // Channel name
    const name = data.name;
    if(!(typeof name === 'string') || name.length === 0) {
        throw new functions.https.HttpsError('invalid-argument', 'Invalid channel name');
    }
    // Create channel
    const userId = context.auth.uid;
    const channelId = uuid();
    const channel: IChannel = {
        id: channelId,
        owner: userId,
        name: name,
    };
    const doc = db.doc(`channels/${channelId}`);
    await doc.set(channel);
    await addLog(log, 'createChannel', {
        eventSource: 'channel',
        value: channel,
        message: `Channel ${channelId} : ${name}`
    });
    return channel
});

exports.getChannels = functions.https.onCall(async (data, context) => {
    if(!context.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated to make this request');
    }
    // Check User
    const user = data.user;
    try {
        await admin.auth().getUser(user);
    }
    catch {
        throw new functions.https.HttpsError('invalid-argument', 'User could not found');
    }
    const query = db.collection('channels').where('owner', '==', user).limit(100);
    const querySnapshot = await query.get();
    const channels = querySnapshot.docs.map(docSnap => docSnap.data());
    return channels;
})

exports.masterUploadComplete = functions.storage.bucket('meteor-247517.appspot.com').object().onFinalize(async object => {
    if(!object.name) { return; }
    await addLog(log, 'masterUploadComplete', {
        eventSource: 'video',
        value: object,
        message: `Object uploaded as ${object.name} to ${object.bucket}`
    });
    if(path.dirname(object.name).startsWith('masters')) {
        // The path now should be /masters/{uId}/{videoId}
        const videoId = path.basename(object.name);
        const docRef = db.doc(`videos/${videoId}`);
        const doc = await docRef.get();
        const data = doc.data() as IVideo;
        if(!doc.exists || data.status !== 'master-upload-ready') {
            // Delete video, invalid upload ID or invalid state
            await admin.storage().bucket('meteor-247517.appspot.com').file(object.name).delete();
            return;
        }
        // Change status
        await docRef.update({
            status: 'master-upload-complete'
        });
        await addLog(log, 'masterUploadComplete', {
            eventSource: 'video',
            value: data,
            message: `Video ${videoId}'s master uploaded`
        });
        // Make file public
        await admin.storage().bucket('meteor-247517.appspot.com').file(object.name).makePublic();
        // Send to Mux
        const url = `https://storage.googleapis.com/meteor-247517.appspot.com/${object.name}`
        const muxResponse = await axios.default.post('https://api.mux.com/video/v1/assets', {
            input: url,
            playback_policy: ["public"],
            passthrough: videoId
        }, {
            auth: {
                username: functions.config().mux.id,
                password: functions.config().mux.secret
            }
        });
        // Get public playback ID
        const playbackId = muxResponse.data.data.playback_ids.find((id: any) => id.policy == "public").id;
        const muxAssetId = muxResponse.data.data.id
        // Update asset ID in DB
        await docRef.update({
            muxAssetId: muxAssetId,
            muxPlaybackId: playbackId
        })
        await addLog(log, 'masterUploadComplete', {
            eventSource: 'video',
            value: data,
            message: `Video ${videoId}'s Mux asset created as ${muxAssetId} with pId ${playbackId}`
        });
        return;
    }
});


exports.muxWebhook = functions.https.onRequest(async (req, res) => {
    const eventType = req.body.type
    await addLog(log, 'muxWebhook', {
        eventSource: 'video',
        value: req.body,
        message: `Mux sent ${eventType}`
    });
    if(eventType == "video.asset.ready") {
        const videoId = req.body.data.passthrough
        const docRef = db.doc(`videos/${videoId}`);
        await docRef.update({
            status: 'transcoded'
        });
        const data = (await docRef.get()).data() as IVideo;
        await admin.storage().bucket('meteor-videos').file(`masters/${data.author}/${data.id}`).makePrivate();
        await addLog(log, 'muxWebHook', {
            eventSource: 'video',
            value: videoId,
            message: `Video ${videoId}'s labelled as transcoded`
        });
    }
    res.status(200).send("Coolio");
})