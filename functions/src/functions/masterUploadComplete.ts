import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { IVideo, IAlgoliaVideoObject } from '../definitions';
import * as path from 'path';
import * as axios from 'axios';
import { addLog, log, db, algoliaIndex } from '../globals';
import { videoFromFirestore, algoliaFromVideo } from '../converters';

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
    const playbackID = muxResponse.data.data.playback_ids.find((id: any) => id.policy == "public").id;
    const assetID = muxResponse.data.data.id

    // Update asset ID in DB
    await docRef.update({
        'muxData.assetID': assetID,
        'muxData.playbackID': playbackID,
    });

    return {
        playbackID, assetID
    };
}

async function addToAlgolia(video: IVideo) {
    const videoObj: IAlgoliaVideoObject = algoliaFromVideo(video);
    await algoliaIndex.addObject(videoObj, video.id);
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
        const videoDocRef = db.doc(`videos/${videoId}`);
        const doc = await videoDocRef.get();
        if(!doc.exists) {
            // Invalid ID
            await admin.storage().bucket('meteor-247517.appspot.com').file(object.name).delete();
            return;
        }
        // Guarenteed doc exist, get data
        const data = doc.data();
        if(!data) { 
            throw new functions.https.HttpsError('not-found', 'Video unable to be found');
        }
        const video: IVideo = videoFromFirestore(data);
        if(video.muxData.status !== 'upload-ready') {
            // Invalid state
            await admin.storage().bucket('meteor-247517.appspot.com').file(object.name).delete();
            return;
        }
        // Change status
        await videoDocRef.update({
            'muxData.status': 'upload-complete',
        });
        await addLog(log, 'masterUploadComplete', {
            eventSource: 'video',
            value: video,
            message: `Video ${videoId}'s master uploaded`
        });

        await Promise.all([addToMux(video, object.name, videoDocRef), addToAlgolia(video)])
        
        await addLog(log, 'masterUploadComplete', {
            eventSource: 'video',
            value: video,
            message: `Video ${videoId}'s Mux asset and Algolia index created`
        });
        return;
    }
});