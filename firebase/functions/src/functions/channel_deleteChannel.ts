import * as functions from 'firebase-functions';
import * as axios from 'axios';
import { db, addLog, log, algoliaIndex } from '../globals';
import { channelSchemaFromFirestore, videoSchemaFromFirestore } from '../converters';
import admin = require('firebase-admin');

export const channel_deleteChannel = functions.https.onCall(async (data, context) => {
    if(!context.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated to make this request');
    }
    // Check channel existence
    const channelId = data.channel;
    if(!(typeof channelId === 'string') || channelId.length === 0) {
        throw new functions.https.HttpsError('invalid-argument', 'Channel does not exist');
    }
    const channelDoc = db.doc(`channels/${channelId}`);
    const channelSnap = await channelDoc.get();
    const channelData = channelSnap.data();
    if(!channelSnap.exists || !channelData) {
        throw new functions.https.HttpsError('invalid-argument', 'Channel does not exist');
    }
    const channelSchema = channelSchemaFromFirestore(channelData);

    // Check owner
    if(context.auth.uid != channelSchema.owner) {
        throw new functions.https.HttpsError('permission-denied', 'User must be owner of channel to delete it');
    }

    // First submit job to delete search indexes
    const algoliaPromise = algoliaIndex.deleteBy({
        filters: `channelID:${channelSchema.id} OR id:${channelSchema.id}`,
    });
    
    // Then delete channel art
    const bucketPromise = admin.storage().bucket('meteor-247517.appspot.com').deleteFiles({
        prefix: `channelAssets/${channelSchema.id}`,
        force: true,
    });

    // Next, delete all videos of channel
    const ref = db.collection('videos').where('channelID', '==', channelSchema.id);
    const batch = db.batch();
    const docs = await ref.get();
    const muxPromises: Promise<axios.AxiosResponse>[] = [];
    docs.forEach((snap) => {
        batch.delete(snap.ref);
        const videoSchema = videoSchemaFromFirestore(snap.data());
        const responsePromise = axios.default.delete(`https://api.mux.com/video/v1/assets/${videoSchema.muxData.assetID}`,{
            auth: {
                username: functions.config().mux.id,
                password: functions.config().mux.secret
            }
        });
        muxPromises.push(responsePromise);
    });
    const firestorePromise = batch.commit();

    // Also delete all mux assets 
    const muxPromise = Promise.all(muxPromises);

    await Promise.all([algoliaPromise, firestorePromise, muxPromise, bucketPromise]);

    // Finally, delete channel doc
    await channelDoc.delete();

    await addLog(log, 'deleteChannel', {
        eventSource: 'channel',
        value: channelSchema,
        message: `Channel ${channelSchema.id} : ${channelSchema.name} deleted`
    });
    return channelSchema
});