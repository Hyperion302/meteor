import * as functions from 'firebase-functions';
import { IVideo } from '../definitions';
import * as uuid from 'uuid/v4';
import { db, addLog, log } from '../globals';

export const createVideo = functions.https.onCall(async (data, context) => {
    // Check auth
    if(!context.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated to make this request');
    }
    // Get Title
    const title = data.title;
    if(!(typeof title === 'string') || title.length === 0) {
        throw new functions.https.HttpsError('invalid-argument', 'Invalid title');
    }
    // Check channel existence
    const channelId = data.channel;
    if(!(typeof channelId === 'string') || channelId.length === 0) {
        throw new functions.https.HttpsError('invalid-argument', 'Channel does not exist');
    }
    const channelDoc = db.doc(`channels/${channelId}`);
    const channelSnap = await channelDoc.get();
    if(!channelSnap.exists) {
        throw new functions.https.HttpsError('invalid-argument', 'Channel does not exist');
    }
    // TODO: Better keys
    const keywords = title.split(' ');
    // Create video
    const userId = context.auth.uid;
    const videoId = uuid();
    const video: IVideo = {
        id: videoId,
        author: userId,
        channel: channelId,
        title: title,
        titleKeys: keywords,
        status: 'master-upload-ready'
    };
    const doc = db.doc(`videos/${videoId}`);
    await doc.set(video);
    await addLog(log, 'createVideo', {
        eventSource: 'video',
        value: video,
        message: `Video ${videoId} : ${title} created in DB`
    });
    return video;
});