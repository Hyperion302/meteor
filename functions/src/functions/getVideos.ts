import * as functions from 'firebase-functions';
import { db } from '../globals';
import { videoFromFirestore } from '../converters';

export const getVideos = functions.https.onCall(async (data, context) => {
    if(!context.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated to make this request');
    }

    // Check channel existence
    const channel = data.channel;
    if(!(typeof channel === 'string') || channel.length === 0) {
        throw new functions.https.HttpsError('invalid-argument', 'Invalid title');
    }
    const channelDoc = db.doc(`channels/${channel}`);
    const channelSnap = await channelDoc.get();
    if(!channelSnap.exists) {
        throw new functions.https.HttpsError('invalid-argument', 'Channel does not exist');
    }

    const query = db.collection('videos').where('channel.id', '==', channel); // TODO: Pagination
    const querySnapshot = await query.get();
    const videos = querySnapshot.docs.map(docSnap => {
        return videoFromFirestore(docSnap.data());
    });
    return videos;
});