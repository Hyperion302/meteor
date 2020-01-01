import * as functions from 'firebase-functions';
import { IChannel } from '../definitions';
import { db, addLog, log } from '../globals';
import { channelFromFirestore } from '../converters';

export const updateChannel = functions.https.onCall(async (data, context) => {
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
    const channel: IChannel = channelFromFirestore(channelData);

    // Check owner
    if(context.auth.uid != channel.owner) {
        throw new functions.https.HttpsError('permission-denied', 'User must be owner of channel to delete it');
    }

    // Get fields to edit
    let willEditName = false;
    let newChannel: IChannel = channel;

    if(data.name) {
        if(!(typeof data.name === 'string') || data.name.length === 0) {
            throw new functions.https.HttpsError('invalid-argument', 'Invalid channel name');
        }
        willEditName = true;
    }

    // Edit name if necessary
    if(willEditName) {
        newChannel.name = data.name
    }

    await channelDoc.update(newChannel);

    await addLog(log, 'deleteChannel', {
        eventSource: 'channel',
        value: newChannel,
        message: `Channel ${channel.id} : ${channel.name} updated ${willEditName ? 'n' : ''}`
    });
    return channel;
});