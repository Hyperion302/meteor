import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

// Call before imports
admin.initializeApp(functions.config().firebase);

export { channel_createChannel } from './functions/channel_createChannel';
export { channel_getVideos } from './functions/channel_getVideos';
export { channel_updateChannel } from './functions/channel_updateChannel';
export { channel_deleteChannel } from './functions/channel_deleteChannel';
export { channel_getChannel } from './functions/channel_getChannel';

export { video_createVideo } from './functions/video_createVideo';
export { video_getVideo } from './functions/video_getVideo';
export { video_deleteVideo } from './functions/video_deleteVideo';
export { video_updateVideo } from './functions/video_updateVideo';

export { user_getChannels } from './functions/user_getChannels';

export { event_objectFinalized } from './functions/event_objectFinalized';
export { event_muxWebhook } from './functions/event_muxWebhook';


