import * as functions from 'firebase-functions';
import { ISchemaVideo, IMuxData } from '../definitions';
import * as uuid from 'uuid/v4';
import { db, addLog, log } from '../globals';
import { channelSchemaFromFirestore, resolveVideo } from '../converters';

export const video_createVideo = functions.https.onCall(async (data, context) => {
    // Check auth
    if(!context.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated to make this request');
    }
    // Get Title
    const title = data.title;
    if(!(typeof title === 'string') || title.length === 0) {
        throw new functions.https.HttpsError('invalid-argument', 'Invalid title');
    }
    // Get description
    const description = data.description;
    if(!(typeof description === 'string') || description.length === 0 || description.length > 5000) {
        throw new functions.https.HttpsError('invalid-argument', 'Invalid description');
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

    // Check ownership
    if(context.auth.uid != channel.owner) {
        throw new functions.https.HttpsError('permission-denied', 'Only the channel owner can upload videos');
    }
    
    // Create video
    const userId = context.auth.uid;
    const id = uuid();
    const mux: IMuxData = {
        status: 'upload-ready',
        assetID: null,
        playbackID: null,
    };
    const video: ISchemaVideo = {
        id: id,
        author: userId,
        channelID: channel.id,
        title: title,
        description: description,
        muxData: mux,
        uploadDate: parseInt((new Date().getTime() / 1000).toFixed(0)), // right now in unix timestamp
    };
    const doc = db.doc(`videos/${id}`);
    await doc.set(video);
    await addLog(log, 'createVideo', {
        eventSource: 'video',
        value: video,
        message: `Video ${id} : ${title} created in DB`
    });
    const resolvedVideo = await resolveVideo(db, video);
    return resolvedVideo;
});