import * as functions from 'firebase-functions';
import { db, addLog, log, algoliaIndex } from '../globals';
import { channelSchemaFromFirestore, resolveChannel, algoliaFromChannel } from '../converters';

export const channel_updateChannel = functions.https.onCall(async (data, context) => {
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
    const channel = channelSchemaFromFirestore(channelData);

    // Check owner
    if(context.auth.uid != channel.owner) {
        throw new functions.https.HttpsError('permission-denied', 'User must be owner of channel to update it');
    }

    // Get fields to edit
    let willEditName = false;
    let newChannel = channel;

    if(data.name) {
        if(!(typeof data.name === 'string') || data.name.length === 0) {
            throw new functions.https.HttpsError('invalid-argument', 'Invalid channel name');
        }
        willEditName = true;
        channel.name = data.name;
    }

    // Update in DB
    await channelDoc.update(newChannel);

    // Update in Algolia
    const resolvedChannel = await resolveChannel(db, newChannel);
    const algoliaChannel = algoliaFromChannel(resolvedChannel);
    await algoliaIndex.saveObject(algoliaChannel);

    await addLog(log, 'updateChannel', {
        eventSource: 'channel',
        value: newChannel,
        message: `Channel ${channel.id} : ${channel.name} updated ${willEditName ? 'n' : ''}`
    });
    return channel;
});