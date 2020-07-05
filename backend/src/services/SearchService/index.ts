import { IVideo } from '@services/VideoDataService/definitions';
import { IChannel } from '@services/ChannelDataService/definitions';
import { tID, IServiceInvocationContext, IError } from '@/definitions';
import { algoliaIndexInstance } from '@/sharedInstances';
import { IVideoSearchObject, IChannelSearchObject } from './definitions';
import { AuthorizationError } from '@/errors';

function algoliaFromVideo(video: IVideo): IVideoSearchObject {
  return {
    objectID: video.id,
    title: video.title,
    description: video.description,
    uploadDate: video.uploadDate,
    // Assume 0 watch time when converting from video schema
    watchtime: 0,
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
  if (!context.auth.elevated && context.auth.userID !== video.channel.owner) {
    throw new AuthorizationError('Search', 'add video to search index');
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
    !context.auth.elevated &&
    context.auth.userID !== video.channel.owner &&
    context.auth.userID !== video.author
  ) {
    throw new AuthorizationError('Search', 'update video in search index');
  }
  await algoliaIndexInstance.saveObject(algoliaFromVideo(video));
}
/**
 * Updates the watchtime of a video in the search index
 * @param context Invocation context
 * @param videoID ID of the video to update
 * @param watchtime New watchtime in seconds
 */
export async function updateWatchtime(
  context: IServiceInvocationContext,
  videoID: tID,
  watchtime: number,
) {
  await algoliaIndexInstance.partialUpdateObject({
    objectID: videoID,
    watchtime,
  });
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
    !context.auth.elevated &&
    context.auth.userID !== video.channel.owner &&
    context.auth.userID !== video.author
  ) {
    throw new AuthorizationError('Search', 'remove video from search index');
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
  if (!context.auth.elevated && context.auth.userID !== channel.owner) {
    throw new AuthorizationError('Search', 'update channel in search index');
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
  if (!context.auth.elevated && context.auth.userID !== channel.owner) {
    throw new AuthorizationError('Search', 'remove channel from search index');
  }
  await algoliaIndexInstance.deleteObject(channel.id);
}
// #endregion
