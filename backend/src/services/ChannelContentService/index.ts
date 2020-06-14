import sharp from 'sharp';
import {
    firestoreInstance,
    storageInstance,
    appConfig,
} from '../../sharedInstances';
import { tID, IServiceInvocationContext } from '../../definitions';
import { AuthorizationError } from '../../errors';
import { CreateWriteStreamOptions } from '@google-cloud/storage';
import { getChannel } from '../ChannelDataService';

const sharpPipeline = sharp().png();
const pipeline_128 = sharpPipeline.clone().resize(128, 128);
const pipeline_64 = sharpPipeline.clone().resize(64, 64);
const pipeline_32 = sharpPipeline.clone().resize(32, 32);

/**
 * Formats and saves a channel icon
 * @param context Invocation Context
 * @param id ID of channel the icon is for
 * @param imageStream Raw upload stream from the user
 */
export async function uploadIcon(
    context: IServiceInvocationContext,
    id: tID,
    imageStream: NodeJS.ReadableStream,
): Promise<{ rawSize: number, size128: number, size64: number, size32: number }> {
    // Authorization Check
    const channel = await getChannel(context, id);
    // Channel icons can only be uploaded by the owner
    if (context.auth.userID != channel.owner) {
        throw new AuthorizationError(
            'ChannelContent',
            'upload icon to channel',
        );
    }
    // Setup size tracker
    let rawSize = 0;
    imageStream.on('data', (data) => {
      rawSize += data.length;
    });
    // Setup storage writestreams
    const path_128 = `channelIcons/${id}_128.png`;
    const path_64 = `channelIcons/${id}_64.png`;
    const path_32 = `channelIcons/${id}_32.png`;
    const storageObject_128 = storageInstance
        .bucket(appConfig.bucket)
        .file(path_128);
    const storageObject_64 = storageInstance
        .bucket(appConfig.bucket)
        .file(path_64);
    const storageObject_32 = storageInstance
        .bucket(appConfig.bucket)
        .file(path_32);
    const storageMetadata: CreateWriteStreamOptions = {
        metadata: {
            contentType: 'image/png',
        },
    };
    const storageWritestream_128 = storageObject_128.createWriteStream(
        storageMetadata,
    );
    const storageWritestream_64 = storageObject_64.createWriteStream(
        storageMetadata,
    );
    const storageWritestream_32 = storageObject_32.createWriteStream(
        storageMetadata,
    );

    // Pipe pipelines
    imageStream.pipe(sharpPipeline);
    pipeline_128.pipe(storageWritestream_128);
    pipeline_64.pipe(storageWritestream_64);
    pipeline_32.pipe(storageWritestream_32);

    // Count written data
    let size128 = 0;
    let size64 = 0;
    let size32 = 0;
    pipeline_128.on('data', (data) => {
      size128 += data.length;
    });
    pipeline_64.on('data', (data) => {
      size64 += data.length;
    })
    pipeline_32.on('data', (data) => {
      size32 += data.length;
    })

    // Wait for upload to finish
    const promises = [
        new Promise((resolve, reject) => {
            storageWritestream_128.on('error', reject);
            storageWritestream_128.on('finish', resolve);
        }),
        new Promise((resolve, reject) => {
            storageWritestream_64.on('error', reject);
            storageWritestream_64.on('finish', resolve);
        }),
        new Promise((resolve, reject) => {
            storageWritestream_32.on('error', reject);
            storageWritestream_32.on('finish', resolve);
        }),
    ];
    await Promise.all(promises);

    // Make public
    await storageObject_128.makePublic();
    await storageObject_64.makePublic();
    await storageObject_32.makePublic();

    return { rawSize, size128, size64, size32 }
}
