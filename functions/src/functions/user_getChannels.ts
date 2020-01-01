import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { db } from '../globals';
import { resolveChannel, channelSchemaFromFirestore } from '../converters';

export const user_getChannels = functions.https.onCall(async (data, context) => {
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
    const channels = Promise.all(querySnapshot.docs.map(docSnap => {
        const schema = channelSchemaFromFirestore(docSnap.data())
        return resolveChannel(db, schema);
    }));
    return channels;
});