import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

// Call before imports
admin.initializeApp(functions.config().firebase);

import { createChannel } from './functions/createChannel';
import { createVideo } from './functions/createVideo';
import { getChannels } from './functions/getChannels';
import { masterUploadComplete } from './functions/masterUploadComplete';
import { muxWebhook } from './functions/muxWebhook';

exports.createChannel = createChannel;
exports.createVideo = createVideo;
exports.getChannels = getChannels;
exports.masterUploadComplete = masterUploadComplete;
exports.muxWebhook = muxWebhook;