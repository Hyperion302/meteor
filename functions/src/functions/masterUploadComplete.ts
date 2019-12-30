import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { IVideo, IAlgoliaChannelObject, IAlgoliaVideoObject } from '../definitions';
import * as path from 'path';
import * as axios from 'axios';
import { addLog, log, db, algoliaIndex } from '../globals';

async function addToMux(video: IVideo, bucketPath: string, docRef: FirebaseFirestore.DocumentReference) {
    // Make file public
    await admin.storage().bucket('meteor-247517.appspot.com').file(bucketPath).makePublic();
    // Send to Mux
    const url = `https://storage.googleapis.com/meteor-247517.appspot.com/${bucketPath}`
    const muxResponse = await axios.default.post('https://api.mux.com/video/v1/assets', {
        input: url,
        playback_policy: ["public"],
        passthrough: video.id
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
    });

    return {
        playbackId, muxAssetId
    };
}

async function addToAlgolia(video: IVideo) {
    // Build IAlgoliaVideoObject using IAlgoliaChannelObject
    const channelId = video.channel;
    const channelDocData = (await db.doc(`channels/${channelId}`).get()).data();
    if(!channelDocData) {
        // Not user facing, fail silently?
        await addLog(log, 'masterUploadComplete', {
            eventSource: 'video',
            value: channelId,
            message: `Could not retrieve channel ${channelId}`
        });
        return;
    }
    const channelObj: IAlgoliaChannelObject = {
        objectId: channelDocData.id,
        name: channelDocData.name,
    };
    const videoObj: IAlgoliaVideoObject = {
        objectId: video.id,
        channel: channelObj,
        title: video.title,
    };

    await algoliaIndex.addObject(videoObj);

    return videoObj;
}

export const masterUploadComplete = functions.storage.bucket('meteor-247517.appspot.com').object().onFinalize(async object => {
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

        await Promise.all([addToMux(data, object.name, docRef), addToAlgolia(data)])
        
        await addLog(log, 'masterUploadComplete', {
            eventSource: 'video',
            value: data,
            message: `Video ${videoId}'s Mux asset and Algolia index created`
        });
        return;
    }
});