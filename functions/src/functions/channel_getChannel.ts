import * as functions from 'firebase-functions';
import { db } from '../globals';
import { channelSchemaFromFirestore, resolveChannel } from '../converters';

export const channel_getChannel = functions.https.onCall(async (data, context) => {
    if(!context.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated to make this request');
    }
    // Check ID
    const channelId = data.channel;
    if(!(typeof channelId === 'string') || channelId.length === 0) {
        throw new functions.https.HttpsError('invalid-argument', 'Invalid channel id');
    }

    const query = db.doc(`channels/${channelId}`);
    const querySnapshot = await query.get();
    const channelData = querySnapshot.data();
    if(!querySnapshot.exists || !channelData) {
        throw new functions.https.HttpsError('not-found', 'Channel not found or could not be retrieved');
    }
    const channelSchema = channelSchemaFromFirestore(channelData);
    const video = await resolveChannel(db, channelSchema);
    return video;
});