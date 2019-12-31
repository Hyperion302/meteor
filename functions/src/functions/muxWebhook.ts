import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { addLog, log, db } from '../globals';
import { videoFromFirestore } from '../converters';

export const muxWebhook = functions.https.onRequest(async (req, res) => {
    const eventType = req.body.type
    await addLog(log, 'muxWebhook', {
        eventSource: 'video',
        value: req.body,
        message: `Mux sent ${eventType}`
    });
    if(eventType == "video.asset.ready") {
        const videoId = req.body.data.passthrough
        const docRef = db.doc(`videos/${videoId}`);
        await docRef.update({
            'muxData.status': 'transcoded',
        });
        const data = (await docRef.get()).data();
        if(!data) {
            throw new functions.https.HttpsError('not-found', 'Video not found or could not be retrieved');
        }
        const video = videoFromFirestore(data);
        await admin.storage().bucket('meteor-247517.appspot.com').file(`masters/${video.author}/${video.id}`).makePrivate();
        await addLog(log, 'muxWebhook', {
            eventSource: 'video',
            value: videoId,
            message: `Video ${videoId}'s labelled as transcoded`
        });
    }
    res.status(200).send("Coolio");
});