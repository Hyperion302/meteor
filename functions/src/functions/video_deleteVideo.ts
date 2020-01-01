import * as functions from 'firebase-functions';
import * as axios from 'axios';
import { db, addLog, log, algoliaIndex } from '../globals';
import { videoSchemaFromFirestore, channelSchemaFromFirestore } from '../converters';

export const video_deleteVideo = functions.https.onCall(async (data, context) => {
    if(!context.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated to make this request');
    }
    // Check video existence
    const videoId = data.video;
    if(!(typeof videoId === 'string') || videoId.length === 0) {
        throw new functions.https.HttpsError('invalid-argument', 'Invalid video id');
    }

    const videoDoc = db.doc(`videos/${videoId}`);
    const videoSnapshot = await videoDoc.get();
    const videoData = videoSnapshot.data();
    if(!videoSnapshot.exists || !videoData) {
        throw new functions.https.HttpsError('not-found', 'Video not found or could not be retrieved');
    }
    const video =  videoSchemaFromFirestore(videoData);
    const channelDoc = db.doc(`channels/${video.channelID}`);
    const channelSnap = await channelDoc.get();
    const channelData = channelSnap.data();
    if(!channelSnap.exists || !channelData) {
        throw new functions.https.HttpsError('invalid-argument', 'Channel does not exist');
    }
    const channelSchema = channelSchemaFromFirestore(channelData);

    // Check owner
    if(context.auth.uid != channelSchema.owner && context.auth.uid != video.author) {
        throw new functions.https.HttpsError('permission-denied', 'Only the video\'s uploader or it\'s channel owner can delete it');
    }

    // First submit job to delete index
    const algoliaPromise = algoliaIndex.deleteObject(video.id);

    // Next delete mux asset
    const muxPromise = axios.default.delete(`https://api.mux.com/video/v1/assets/${video.muxData.assetID}`,{
        auth: {
            username: functions.config().mux.id,
            password: functions.config().mux.secret
        }
    });

    await Promise.all([algoliaPromise, muxPromise]);

    // Finally, delete video doc
    await videoDoc.delete();

    await addLog(log, 'deleteVideo', {
        eventSource: 'video',
        value: video,
        message: `Video ${video.id} : ${video.title} deleted`
    });
    return video
});