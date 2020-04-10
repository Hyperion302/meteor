import { tID, IError, IServiceInvocationContext } from '../../definitions';
import {
    firestoreInstance,
    storageInstance,
    pubsubSubscription,
    appConfig,
} from '../../sharedInstances';
import {
    IVideoContent,
    IMuxAssetDeletedEvent,
    IMuxAssetReadyEvent,
} from './definitions';
import * as VideoDataService from '../VideoDataService';
import * as SearchService from '../SearchService';
import axios from 'axios';
import { ResourceNotFoundError, AuthorizationError } from '../../errors';
import { Message } from '@google-cloud/pubsub';
import uuid from 'uuid/v4';
import { toNamespaced } from '../../utils';
import { IVideo } from '../VideoDataService/definitions';

// Auth Token
const username =
    appConfig.environment == 'prod'
        ? process.env.PROD_MUXID
        : process.env.DEV_MUXID;
const password =
    appConfig.environment == 'prod'
        ? process.env.PROD_MUXSECRET
        : process.env.DEV_MUXSECRET;
const authToken = Buffer.from(
    `${(username ? username : '').replace('\n', '')}:${(password
        ? password
        : ''
    ).replace('\n', '')}`,
    'utf8',
).toString('base64');

// #region Pubsub handler registration
pubsubSubscription.on('message', async (message: Message) => {
    // Process the message and parse it into something we understand
    const bodyData: any = JSON.parse(message.data.toString());
    message.ack();

    // Call muxWebhook
    try {
        switch (bodyData.type) {
            case 'video.asset.ready':
                await handleMuxAssetReady({
                    type: 'ready',
                    assetID: bodyData.object.id,
                    playbackID: bodyData.data.playback_ids.find(
                        (id: any) => id.policy == 'public',
                    ).id,
                    videoID: bodyData.data.passthrough.split(':')[0],
                    contentID: bodyData.data.passthrough.split(':')[1],
                    environment: {
                        name: bodyData.environment.name,
                        id: bodyData.environment.id,
                    },
                });
                break;
            case 'video.asset.deleted':
                await handleMuxAssetDeleted({
                    type: 'deleted',
                    assetID: bodyData.object.id,
                    videoID: bodyData.data.passthrough.split(':')[0],
                    contentID: bodyData.data.passthrough.split(':')[1],
                    environment: {
                        name: bodyData.environment.name,
                        id: bodyData.environment.id,
                    },
                });
                break;
            default:
                break;
        }
    } catch (e) {
        // Log the error since there is no point in throwing
        console.error(e);
    }
});
pubsubSubscription.on('error', (error) => {
    // Log the error since there is no point in throwing
    console.error(`Received PubSub error: ${error}`);
});
// #endregion Pubsub handler registration

/**
 * Handles the mux AssetReady event.  Creates the content record and updates the video reference it.
 * @param muxEvent The mux event to respond to
 */
export async function handleMuxAssetReady(
    muxEvent: IMuxAssetReadyEvent,
): Promise<void> {
    // Get the current video doc and make sure it exists
    const videoDoc = firestoreInstance.doc(
        toNamespaced(`videos/${muxEvent.videoID}`, appConfig.dbPrefix),
    );

    // Create a new video content record
    const videoContent: IVideoContent = {
        id: muxEvent.contentID,
        assetID: muxEvent.assetID,
        playbackID: muxEvent.playbackID,
    };
    const videoContentDoc = firestoreInstance.doc(
        toNamespaced(`content/${muxEvent.contentID}`, appConfig.dbPrefix),
    );
    await videoContentDoc.set(videoContent);

    // Update the current video doc to reference the new content doc and mark the upload date
    await videoDoc.update({
        content: videoContent.id,
        uploadDate: Math.floor(Date.now() / 1000),
    });

    // Add to search index
    // Refetch the video so it has content and an uploadDate
    const videoData = await VideoDataService.getVideo(
        {
            auth: {
                elevated: true,
                userID: null,
                token: null,
            },
        },
        muxEvent.videoID,
    );
    await SearchService.addVideo(
        {
            auth: {
                elevated: true,
                userID: null,
                token: null,
            },
        },
        videoData,
    );
}

/**
 * Handles the mux AssetDeleted event
 * @param muxEvent The mux event to respond to
 */
export async function handleMuxAssetDeleted(
    muxEvent: IMuxAssetDeletedEvent,
): Promise<void> {
    // Make sure the content doc exists
    const contentDoc = firestoreInstance.doc(
        toNamespaced(`content/${muxEvent.contentID}`, appConfig.dbPrefix),
    );
    const contentDocSnap = await contentDoc.get();
    if (!contentDocSnap.exists) {
        throw new ResourceNotFoundError(
            'VideoContent',
            'videoContent',
            muxEvent.contentID,
        );
    }
    // Delete it
    await contentDoc.delete();
}

/**
 * Retrieves a content record
 * @param context Invocation context
 * @param id ID of content record
 */
export async function getVideo(
    context: IServiceInvocationContext,
    id: tID,
): Promise<IVideoContent> {
    const contentDoc = firestoreInstance.doc(
        toNamespaced(`content/${id}`, appConfig.dbPrefix),
    );
    const contentDocSnap = await contentDoc.get();
    if (!contentDocSnap.exists) {
        throw new ResourceNotFoundError('VideoContent', 'videoContent', id);
    }
    const contentData = contentDocSnap.data();

    return {
        id,
        assetID: contentData.assetID,
        playbackID: contentData.playbackID,
    };
}

/**
 * Utility function to pipe data and resolve a promise when the pipe is complete (or reject on error)
 * @param readStream Stream to read from
 * @param writeStream Stream to write to
 */
function promisePiper(
    readStream: NodeJS.ReadableStream,
    writeStream: NodeJS.WritableStream,
): Promise<void> {
    return new Promise((resolve, reject) => {
        readStream.pipe(writeStream);
        writeStream.on('finish', () => {
            resolve();
        });
    });
}

/**
 * Upload a video to the CDN and call the transcoder on complete
 * @param context Invocation context
 * @param id ID of video to upload
 * @param fileStream Filestream of video data
 * @param mime Mimetype of video
 */
export async function uploadVideo(
    context: IServiceInvocationContext,
    id: tID,
    fileStream: NodeJS.ReadableStream,
    mime: string,
): Promise<void> {
    const video = await VideoDataService.getVideo(context, id);
    // Authorization Check
    // Video can only be uploaded by author
    if (context.auth.userID != video.author) {
        throw new AuthorizationError('VideoContent', 'upload video data');
    }

    // Build our storage path
    const path = `masters/${context.auth.userID}/${id}`;
    const storageObject = storageInstance.bucket(appConfig.bucket).file(path);
    // Create the storage writestream
    const storageWritestream = storageObject.createWriteStream({
        metadata: {
            contentType: mime,
        },
    });
    // Upload
    await promisePiper(fileStream, storageWritestream);
    // Make public for axios
    await storageObject.makePublic();
    // Call transcoder

    // NOTE: Here is where I create the UUID for the new content record.
    // The passthrough value takes the form <videoID>:<contentID>
    await axios.post(
        'https://api.mux.com/video/v1/assets',
        {
            input: `https://storage.googleapis.com/${appConfig.bucket}/${path}`,
            playback_policy: ['public'],
            passthrough: `${id}:${uuid()}`,
        },
        {
            headers: {
                Authorization: `Basic ${authToken}`,
            },
        },
    );
    // We're done here
}

/**
 * Delete a video from the CDN
 * @param context Invocation context
 * @param id ID of a videos content record to delete
 */
export async function deleteVideo(context: IServiceInvocationContext, id: tID) {
    // Retrieve content record
    const contentRecord = await getVideo(context, id);
    // Delete from mux.  Upon successful deletion the content record will be deleted

    await axios.delete(
        `https://api.mux.com/video/v1/assets/${contentRecord.assetID}`,
        {
            headers: {
                Authorization: `Basic ${authToken}`,
            },
        },
    );
}
