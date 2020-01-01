import * as functions from 'firebase-functions';
import { db } from '../globals';
import { videoSchemaFromFirestore, resolveVideo } from '../converters';

// TODO: IMPLEMENT USING ALGOLIA


export const channel_getVideos = functions.https.onCall(async (data, context) => {
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

    const query = db.collection('videos').where('channelID', '==', channel).limit(20); // TODO: Pagination
    const querySnapshot = await query.get();
    // \/ this is why I need algolia...
    const videos = await Promise.all(querySnapshot.docs.map(docSnap => {
        return resolveVideo(db, videoSchemaFromFirestore(docSnap.data()));
    }));
    return videos;
});