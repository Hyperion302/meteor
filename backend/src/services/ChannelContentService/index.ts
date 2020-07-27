import sharp from 'sharp';
import { storageInstance, appConfig } from '@/sharedInstances';
import { tID, IServiceInvocationContext } from '@/definitions';
import { AuthorizationError } from '@/errors';
import { CreateWriteStreamOptions } from '@google-cloud/storage';
import { getChannel } from '@services/ChannelDataService';

const sharpPipeline = sharp().png();
const pipeline128 = sharpPipeline.clone().resize(128, 128);
const pipeline64 = sharpPipeline.clone().resize(64, 64);
const pipeline32 = sharpPipeline.clone().resize(32, 32);

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
): Promise<{
  rawSize: number;
  size128: number;
  size64: number;
  size32: number;
}> {
  // Authorization Check
  const channel = await getChannel(context, id);
  // Channel icons can only be uploaded by the owner
  if (context.auth.userID !== channel.owner) {
    throw new AuthorizationError('ChannelContent', 'upload icon to channel');
  }
  // Setup size tracker
  let rawSize = 0;
  imageStream.on('data', (data) => {
    rawSize += data.length;
  });
  // Setup storage writestreams
  const path128 = `channelIcons/${id}_128.png`;
  const path64 = `channelIcons/${id}_64.png`;
  const path32 = `channelIcons/${id}_32.png`;
  const storageObject128 = storageInstance
    .bucket(appConfig.bucket)
    .file(path128);
  const storageObject64 = storageInstance.bucket(appConfig.bucket).file(path64);
  const storageObject32 = storageInstance.bucket(appConfig.bucket).file(path32);
  const storageMetadata: CreateWriteStreamOptions = {
    metadata: {
      contentType: 'image/png',
    },
  };
  const storageWriteStream128 = storageObject128.createWriteStream(
    storageMetadata,
  );
  const storageWriteStream64 = storageObject64.createWriteStream(
    storageMetadata,
  );
  const storageWriteStream32 = storageObject32.createWriteStream(
    storageMetadata,
  );

  // Pipe pipelines
  imageStream.pipe(sharpPipeline);
  pipeline128.pipe(storageWriteStream128);
  pipeline64.pipe(storageWriteStream64);
  pipeline32.pipe(storageWriteStream32);

  // Count written data
  let size128 = 0;
  let size64 = 0;
  let size32 = 0;
  pipeline128.on('data', (data) => {
    size128 += data.length;
  });
  pipeline64.on('data', (data) => {
    size64 += data.length;
  });
  pipeline32.on('data', (data) => {
    size32 += data.length;
  });

  // Wait for upload to finish
  const promises = [
    new Promise((resolve, reject) => {
      storageWriteStream128.on('error', reject);
      storageWriteStream128.on('finish', resolve);
    }),
    new Promise((resolve, reject) => {
      storageWriteStream64.on('error', reject);
      storageWriteStream64.on('finish', resolve);
    }),
    new Promise((resolve, reject) => {
      storageWriteStream32.on('error', reject);
      storageWriteStream32.on('finish', resolve);
    }),
  ];
  await Promise.all(promises);

  // Make public
  await storageObject128.makePublic();
  await storageObject64.makePublic();
  await storageObject32.makePublic();

  return { rawSize, size128, size64, size32 };
}
