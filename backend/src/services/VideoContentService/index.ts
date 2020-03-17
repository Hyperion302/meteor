import { tID, IError, IServiceInvocationContext } from '../../definitions';
import { firestoreInstance, storageInstance } from '../../sharedInstances';
import { IVideoContent } from './definitions';
import axios from 'axios';

/**
 * Retrieves a content record
 * @param context Invocation context
 * @param id ID of content record
 */
export async function getVideo(
    context: IServiceInvocationContext,
    id: tID,
): Promise<IVideoContent> {
    const contentDoc = firestoreInstance.doc(`content/${id}`);
    const contentDocSnap = await contentDoc.get();
    if (!contentDocSnap.exists) {
        const error: IError = {
            resource: id,
            message: `Could not find content record ${id}`,
        };
        throw error;
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
 * @param uploader Uploader of video file
 * @param fileStream Filestream of video data
 * @param mime Mimetype of video
 */
export async function uploadVideo(
    context: IServiceInvocationContext,
    id: tID,
    uploader: tID,
    fileStream: NodeJS.ReadableStream,
    mime: string,
): Promise<void> {
    // In the future I'll check if this "uploader" can upload to the channel and if the video is even available for upload
    // Build our storage path
    const path = `masters/${uploader}/${id}`;
    const storageObject = storageInstance.bucket('meteor-videos').file(path);
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
    await axios.post(
        'https://api.mux.com/video/v1/assets',
        {
            input: `https://storage.googleapis.com/meteor-videos/${path}`,
            playback_policy: ['public'],
            passthrough: id,
        },
        {
            auth: {
                username: process.env.MUXID,
                password: process.env.MUXSECRET,
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
    // Delete from mux
    await axios.delete(
        `https://api.mux.com/video/v1/assets/${contentRecord.assetID}`,
        {
            auth: {
                username: process.env.MUXID,
                password: process.env.MUXSECRET,
            },
        },
    );
    // Delete content record
    const contentDoc = firestoreInstance.doc(`content/id`);
    await contentDoc.delete();
}
