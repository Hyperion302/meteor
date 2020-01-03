import * as functions from 'firebase-functions';
import { ISchemaChannel } from '../definitions';
import * as uuid from 'uuid/v4';
import { db, addLog, log, algoliaIndex } from '../globals';
import { resolveChannel, algoliaFromChannel } from '../converters';

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
    const schema: ISchemaChannel = {
        id: channelId,
        owner: userId,
        name: name,
    };
    const doc = db.doc(`channels/${channelId}`);
    await doc.set(schema);
    await addLog(log, 'createChannel', {
        eventSource: 'channel',
        value: schema,
        message: `Channel ${channelId} : ${name}`
    });
    const resolvedChannel = await resolveChannel(db, schema);
    // Put it in Algolia
    const channelObj = algoliaFromChannel(resolvedChannel);
    await algoliaIndex.addObject(channelObj, channelId);
    
    return resolvedChannel;
});