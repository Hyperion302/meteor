import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { IVideo } from '../definitions';
import * as path from 'path';
import * as axios from 'axios';
import { addLog, log, db } from '../globals';

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