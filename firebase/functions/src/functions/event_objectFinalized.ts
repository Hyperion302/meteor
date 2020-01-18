import * as functions from 'firebase-functions';
import * as path from 'path';
import { addLog, log } from '../globals';

import { event_masterUploadComplete } from './event_masterUploadComplete';
import { event_channelIconUploadComplete } from './event_channelIconUploadComplete';


export const event_objectFinalized = functions.storage.bucket('meteor-247517.appspot.com').object().onFinalize(async object => {
    if(!object.name) { return; }
    await addLog(log, 'objectFinalized', {
        eventSource: 'video',
        value: object,
        message: `Object uploaded as ${object.name} to ${object.bucket}`
    });
    if(path.dirname(object.name).startsWith('masters')) {
        await event_masterUploadComplete(object);
    }
    if(path.dirname(object.name).startsWith('channelAssets')) {
        await event_channelIconUploadComplete(object);
    }
});