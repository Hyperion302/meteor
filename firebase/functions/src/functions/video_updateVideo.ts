import * as functions from 'firebase-functions';
import { db, addLog, log, algoliaIndex } from '../globals';
import { videoSchemaFromFirestore, resolveVideo, algoliaFromVideo } from '../converters';

export const video_updateVideo = functions.https.onCall(async (data, context) => {
    if(!context.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated to make this request');
    }
    // Check video existence
    const videoId = data.video;
    if(!(typeof videoId === 'string') || videoId.length === 0) {
        throw new functions.https.HttpsError('invalid-argument', 'Video does not exist');
    }
    const videoDoc = db.doc(`videos/${videoId}`);
    const videoSnap = await videoDoc.get();
    const videoData = videoSnap.data();
    if(!videoSnap.exists || !videoData) {
        throw new functions.https.HttpsError('invalid-argument', 'Channel does not exist');
    }
    const video = videoSchemaFromFirestore(videoData);

    // Get channel
    const channel = (await resolveVideo(db, video)).channel;

    // Check owner
    if(context.auth.uid != channel.owner || context.auth.uid != video.author) {
        throw new functions.https.HttpsError('permission-denied', 'User must be owner of video to update it');
    }

    // Get fields to edit
    let willEditTitle = false;
    let willEditDescription = false;
    const newVideo = video;

    if(data.title) {
        if(!(typeof data.title === 'string') || data.title.length === 0) {
            throw new functions.https.HttpsError('invalid-argument', 'Invalid video title');
        }
        willEditTitle = true;
        newVideo.title = data.title;
    }

    if(data.description) {
        if(!(typeof data.description === 'string') || data.description.length === 0 || data.description.length > 5000) {
            throw new functions.https.HttpsError('invalid-argument', 'Invalid description');
        }
        willEditDescription = true;
        newVideo.description = data.description;
    }

    // Update in DB
    await videoDoc.update(newVideo);

    // Update in Algolia
    const resolvedVideo = await resolveVideo(db, newVideo);
    const algoliaVideo = algoliaFromVideo(resolvedVideo);
    await algoliaIndex.saveObject(algoliaVideo);

    await addLog(log, 'updateVideo', {
        eventSource: 'video',
        value: newVideo,
        message: `Video ${video.id} : ${video.title} updated ${willEditTitle ? 't' : ''}${willEditDescription ? 'd' : ''}`
    });
    return video;
});