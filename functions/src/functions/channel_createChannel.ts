import * as functions from 'firebase-functions';
import { IChannel } from '../definitions';
import * as uuid from 'uuid/v4';
import { db, addLog, log } from '../globals';

export const channel_createChannel = functions.https.onCall(async (data, context) => {
    if(!context.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated to make this request');
    }
    // Channel name
    const name = data.name;
    if(!(typeof name === 'string') || name.length === 0) {
        throw new functions.https.HttpsError('invalid-argument', 'Invalid channel name');
    }
    // Create channel
    const userId = context.auth.uid;
    const channelId = uuid();
    const channel: IChannel = {
        id: channelId,
        owner: userId,
        name: name,
    };
    const doc = db.doc(`channels/${channelId}`);
    await doc.set(channel);
    await addLog(log, 'createChannel', {
        eventSource: 'channel',
        value: channel,
        message: `Channel ${channelId} : ${name}`
    });
    return channel
});