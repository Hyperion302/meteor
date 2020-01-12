import * as functions from 'firebase-functions';
import * as path from 'path';
import * as admin from 'firebase-admin';
import * as os from 'os';
import * as mime from 'mime-types';

import { db } from '../globals';
import { channelSchemaFromFirestore } from '../converters';
import { spawn } from 'child-process-promise';
import mkdirpPromise = require('mkdirp-promise');


export async function event_channelIconUploadComplete(object: functions.storage.ObjectMetadata) {
    if(!object.name) { return; }

    // The path now should be /channelAssets/{channelID}/icon
    // TODO: Currently, I allow *anyone* (authenticated) to upload an icon for a channel.
    // However, this state only exists for as long as it takes to upload an icon
    // Get channel
    const channelId = path.basename(path.dirname(object.name));
    const channelDoc = db.doc(`channels/${channelId}`);
    const channelSnap = await channelDoc.get();
    const channelData = channelSnap.data();
    if(!channelSnap.exists || !channelData) {
        throw new functions.https.HttpsError('invalid-argument', 'Channel does not exist');
    }
    const channel = channelSchemaFromFirestore(channelData);
    if(channel.iconStatus == 'uploaded' || channel.iconStatus == 'none') {
        // Delete, not expecting icon
        console.log('Deleted unexpected icon');
        await admin.storage().bucket('meteor-247517.appspot.com').file(object.name).delete();
        return;
    }
    // Allow, expected icon
    // If this is called thumb128, mark as uploaded and move on
    if(path.basename(object.name) == 'thumb128') {
        // Update status
        await channelDoc.update({
            iconStatus: 'uploaded',
        });
        return;
    }
    // Convert it to proper icon
    const bucketObj = admin.storage().bucket('meteor-247517.appspot.com').file(object.name)
    if(!object.contentType) { 
        console.log('Uploaded with no content type');
        // Delete file
        await bucketObj.delete();
        return; 
    }
    const tmpDir = path.join(os.tmpdir(), 'meteor_tmp/')
    const tmpFile = path.join(os.tmpdir(), `meteor_tmp/tmp_file.${mime.extension(object.contentType)}`);
    // Convert to PNG while we're at it
    const tmpThumbFile = path.join(os.tmpdir(), 'meteor_tmp/thumb_file.jpg');
    
    // Make tmp/meteor_tmp/
    await mkdirpPromise(tmpDir);
    
    // Download image into it
    await bucketObj.download({destination: tmpFile});
    
    // Convert
    await spawn('convert', [
        tmpFile,
        '-thumbnail',
        '128x128>',
        tmpThumbFile,
    ]);

    // Delete old
    await bucketObj.delete();

    // Upload new
    const resp = await admin.storage().bucket('meteor-247517.appspot.com').upload(tmpThumbFile, {
        destination: `channelAssets/${channel.id}/thumb128`,
        metadata: {
            contentType: 'image/jpeg',
        }
    });

    // Make public
    await admin.storage().bucket('meteor-247517.appspot.com').file(resp[0].name).makePublic();

    return;
}