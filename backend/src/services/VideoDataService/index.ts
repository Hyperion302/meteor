import { tID, IError } from '../../../src/definitions';
import { IVideo, IVideoQuery, IVideoSchema } from './definitions';
import * as uuid from 'uuid/v4';
import { firestoreInstance } from '../../../src/sharedInstances';
import { getChannelData } from '../ChannelDataService';
import { getVideoContent } from '../VideoContentService';
import { addVideoIndex } from '../SearchService';

async function getSingleVideoRecord(id: tID): Promise<IVideo> {
    // Get basic video data
    const videoDoc = firestoreInstance.doc(`videos/${id}`);
    const videoDocSnap = await videoDoc.get();
    if (!videoDocSnap.exists) {
        const error: IError = {
            resource: id,
            message: `Could not find video ${id}`
        };
        throw error;
    }
    const videoData = videoDocSnap.data();

    // Get channel data
    const channelData = await getChannelData(videoData.channel);

    // Get content data.  If there's no content data that means there's no uploaded video data for a video
    const contentData = videoData.content
        ? await getVideoContent(videoData.content)
        : null;

    return {
        id: id,
        author: videoData.author,
        title: videoData.title,
        description: videoData.description,
        uploadDate: videoData.uploadDate,
        channel: channelData,
        content: contentData
    };
}

export async function queryVideoData(query: IVideoQuery): Promise<IVideo[]> {
    if (!(query.after || query.before || query.author || query.channel)) {
        // No query
        const error: IError = {
            resource: query,
            message: `No query provided`
        };
        throw error;
    }
    if (query.after && query.before && query.after <= query.before) {
        // Invalid dates
        const error: IError = {
            resource: query,
            message: `Invalid dates provided in video query`
        };
        throw error;
    }
    // Build FS query
    const collection = firestoreInstance.collection('videos');
    let fsQuery = undefined;
    if (query.after) {
        fsQuery = (fsQuery ? fsQuery : collection).where(
            'uploadDate',
            '>',
            query.after
        );
    }
    if (query.before) {
        fsQuery = (fsQuery ? fsQuery : collection).where(
            'uploadDate',
            '<',
            query.before
        );
    }
    if (query.author) {
        fsQuery = (fsQuery ? fsQuery : collection).where(
            'author',
            '==',
            query.author
        );
    }
    if (query.channel) {
        fsQuery = (fsQuery ? fsQuery : collection).where(
            'channel',
            '==',
            query.channel
        );
    }
    if (!fsQuery) {
        const error: IError = {
            resource: query,
            message: 'An unexpected error occured',
            longMessage:
                'fsQuery was undefined when it should have been overwritten at *some* point'
        };
        throw error;
    }

    // Query FS
    const querySnap = await fsQuery.get();
    const queryPromises = querySnap.docs.map((doc) => {
        return getSingleVideoRecord(doc.id);
    });

    // Wait for all to run
    const videos = await Promise.all(queryPromises);
    return videos;
}

export async function getVideoData(id: tID): Promise<IVideo> {
    return await getSingleVideoRecord(id);
}

export async function createVideoData(
    title: string,
    description: string,
    author: string,
    channel: tID
): Promise<IVideo> {
    // Fetch channel that was referenced
    const channelData = await getChannelData(channel);

    const videoData: IVideo = {
        id: uuid.default(),
        author: author,
        channel: channelData,
        title: title,
        description: description,
        content: null,
        uploadDate: 0
    };

    // Add to search index
    await addVideoIndex(videoData);

    // Add to DB
    const videoDoc = firestoreInstance.doc(`videos/${videoData.id}`);
    await videoDoc.set({
        id: videoData.id,
        author: videoData.author,
        channel: videoData.channel.id,
        title: videoData.title,
        description: videoData.description,
        content: null,
        uploadDate: 0
    }); // Uses a schema form of IVideo
    return videoData;
}
