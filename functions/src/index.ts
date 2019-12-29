import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

// Call before imports
admin.initializeApp(functions.config().firebase);

export { createChannel } from './functions/createChannel';
export { createVideo } from './functions/createVideo';
export { getChannels } from './functions/getChannels';
export { masterUploadComplete } from './functions/masterUploadComplete';
export { muxWebhook } from './functions/muxWebhook';
export { getVideos } from './functions/getVideos';