import * as functions from 'firebase-functions';
import { db } from '../globals';
import { videoFromFirestore } from '../converters';

export const video_getVideo = functions.https.onCall(async (data, context) => {
    if(!context.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated to make this request');
    }
    // Check ID
    const videoId = data.video;
    if(!(typeof videoId === 'string') || videoId.length === 0) {
        throw new functions.https.HttpsError('invalid-argument', 'Invalid video id');
    }

    const query = db.doc(`videos/${videoId}`);
    const querySnapshot = await query.get();
    const videoData = querySnapshot.data();
    if(!querySnapshot.exists || !videoData) {
        throw new functions.https.HttpsError('not-found', 'Video not found or could not be retrieved');
    }
    return videoFromFirestore(videoData);
});