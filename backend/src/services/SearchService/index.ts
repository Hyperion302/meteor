import { IVideo } from '../VideoDataService/definitions';
import { IChannel } from '../ChannelDataService/definitions';
import { tID, IServiceInvocationContext, IError } from '../../definitions';
import { algoliaIndexInstance } from '../../sharedInstances';
import { IVideoSearchObject, IChannelSearchObject } from './definitions';

function algoliaFromVideo(video: IVideo): IVideoSearchObject {
    return {
        objectID: video.id,
        title: video.title,
        description: video.description,
        uploadDate: video.uploadDate,
        type: 'video',
    };
}

function algoliaFromChannel(channel: IChannel): IChannelSearchObject {
    return {
        objectID: channel.id,
        name: channel.name,
        type: 'channel',
    };
}

// #region Video
/**
 * Adds a video to the search index
 * @param context Invocation context
 * @param video Video to add
 */
export async function addVideo(
    context: IServiceInvocationContext,
    video: IVideo,
) {
    // Authorization check
    // Videos can only be created on channels owned by the author
    // (Author in this case can be assumed to be the caller, since the video is being added to the index)
    if (context.auth.userID != video.channel.owner) {
        const error: IError = {
            resource: video,
            message: 'Unauthorized to add video to chanenl',
        };
        throw error;
    }
    await algoliaIndexInstance.saveObject(algoliaFromVideo(video));
}
/**
 * Updates a video in the search index
 * @param context Invocation context
 * @param video Video to update
 */
export async function updateVideo(
    context: IServiceInvocationContext,
    video: IVideo,
) {
    // Authorization check
    // Videos can only be updated by the author or the channel owner
    if (
        context.auth.userID != video.channel.owner &&
        context.auth.userID != video.author
    ) {
        const error: IError = {
            resource: video,
            message: 'Unauthorized to update video',
        };
        throw error;
    }
    await algoliaIndexInstance.saveObject(algoliaFromVideo(video));
}
/**
 * Removes a video from the search index
 * @param context Invocation context
 * @param video Video to remove
 */
export async function removeVideo(
    context: IServiceInvocationContext,
    video: IVideo,
) {
    // Authorization check
    // Videos can only be removed by the author or the channel owner
    if (
        context.auth.userID != video.channel.owner &&
        context.auth.userID != video.author
    ) {
        const error: IError = {
            resource: video,
            message: 'Unauthorized to remove video',
        };
        throw error;
    }

    await algoliaIndexInstance.deleteObject(video.id);
}
// #endregion

// #region Channel
/**
 * Adds a channel to the search index
 * @param context Invocation context
 * @param channel Channel to add
 */
export async function addChannel(
    context: IServiceInvocationContext,
    channel: IChannel,
) {
    await algoliaIndexInstance.saveObject(algoliaFromChannel(channel));
}
/**
 * Updates a channel in the search index
 * @param context Invocation context
 * @param channel
 */
export async function updateChannel(
    context: IServiceInvocationContext,
    channel: IChannel,
) {
    // Authorization check
    // Channels can only be updated by the owner
    if (context.auth.userID != channel.owner) {
        const error: IError = {
            resource: channel,
            message: 'Unauthorized to update channel',
        };
        throw error;
    }
    await algoliaIndexInstance.saveObject(algoliaFromChannel(channel));
}
/**
 * Removes a channel from the search index
 * @param context Invocation context
 * @param channel Channel to remove
 */
export async function removeChannel(
    context: IServiceInvocationContext,
    channel: IChannel,
) {
    // Authorization check
    // Channels can only be removed by the owner
    if (context.auth.userID != channel.owner) {
        const error: IError = {
            resource: channel,
            message: 'Unauthorized to update channel',
        };
        throw error;
    }
    await algoliaIndexInstance.deleteObject(channel.id);
}
// #endregion
