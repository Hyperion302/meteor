import { tID, IError, IServiceInvocationContext } from '@/definitions';
import { IVideo, IVideoQuery, IVideoSchema, IVideoUpdate } from './definitions';
import uuid from 'uuid/v4';
import { firestoreInstance, appConfig } from '@/sharedInstances';
import * as channelDataService from '@services/ChannelDataService';
import * as videoContentService from '@services/VideoContentService';
import * as searchService from '@services/SearchService';
import * as watchtimeService from '@services/WatchTimeService';
import {
  AuthorizationError,
  ResourceNotFoundError,
  InvalidQueryError,
  InternalError,
} from '@/errors';
import { toNamespaced, toGlobal } from '@/utils';

// Predefined constants
const MAX_VIDEOS: number = 1000;

/**
 * Get a single video record
 * @param context Invocation context
 * @param id Video record id
 * @returns Promise that resolves to a found video record
 * @ignore
 */
async function getSingleVideoRecord(
  context: IServiceInvocationContext,
  id: tID,
): Promise<IVideo> {
  // Get basic video data
  const videoDoc = firestoreInstance.doc(
    toNamespaced(`videos/${id}`, appConfig.dbPrefix),
  );
  const videoDocSnap = await videoDoc.get();
  if (!videoDocSnap.exists) {
    throw new ResourceNotFoundError('VideoData', 'video', id);
  }
  const videoData = videoDocSnap.data();

  // Get channel data
  const channelData = await channelDataService.getChannel(
    context,
    videoData.channel,
  );

  // Get content data.  If there's no content data that means there's no uploaded video data for a video
  const contentData = videoData.content
    ? await videoContentService.getVideo(context, videoData.content)
    : null;

  return {
    id,
    author: videoData.author,
    title: videoData.title,
    description: videoData.description,
    uploadDate: videoData.uploadDate,
    channel: channelData,
    content: contentData,
  };
}

/**
 * Query for videos
 * @param context Invocation context
 * @param query Video query object
 * @returns Promise that resolves to a list of found videos
 */
export async function queryVideo(
  context: IServiceInvocationContext,
  query: IVideoQuery,
): Promise<IVideo[]> {
  if (!(query.after || query.before || query.author || query.channel)) {
    // No query
    throw new InvalidQueryError('VideoData', query);
  }
  if (query.after && query.before && query.after <= query.before) {
    // Invalid dates
    throw new InvalidQueryError('VideoData', query);
  }
  // Build FS query
  const collection = firestoreInstance.collection(
    toNamespaced('videos', appConfig.dbPrefix),
  );
  let fsQuery;
  if (query.after) {
    fsQuery = (fsQuery ? fsQuery : collection).where(
      'uploadDate',
      '>',
      parseInt(query.after, 10),
    );
  }
  if (query.before) {
    fsQuery = (fsQuery ? fsQuery : collection).where(
      'uploadDate',
      '<',
      parseInt(query.before, 10),
    );
  }
  if (query.author) {
    fsQuery = (fsQuery ? fsQuery : collection).where(
      'author',
      '==',
      query.author,
    );
  }
  if (query.channel) {
    fsQuery = (fsQuery ? fsQuery : collection).where(
      'channel',
      '==',
      query.channel,
    );
  }
  if (!fsQuery) {
    throw new InternalError(
      'VideoData',
      'fsQuery was not supposed to be undefined',
    );
  }

  // Query FS
  const querySnap = await fsQuery.get();
  const queryPromises = querySnap.docs.map((doc) => {
    // doc.id is in namespaced form
    return getSingleVideoRecord(context, doc.id);
  });

  // Wait for all to run
  const videos = await Promise.all(queryPromises);
  return videos;
}

/**
 * Get a single video
 * @param context Invocation context
 * @param id ID of video to retrieve
 * @returns Promise that resolves to retrieved video
 */
export async function getVideo(
  context: IServiceInvocationContext,
  id: tID,
): Promise<IVideo> {
  return await getSingleVideoRecord(context, id);
}

/**
 * Create a video
 * @param context Invocation context
 * @param title Title of video
 * @param description Description of video
 * @param author TEMPORARY, will be removed with auth
 * @param channel Channel to add the video to upon creation
 * @returns Promise that resolves to created video
 */
export async function createVideo(
  context: IServiceInvocationContext,
  title: string,
  description: string,
  channel: tID,
): Promise<IVideo> {
  // Fetch channel that was referenced
  const channelData = await channelDataService.getChannel(context, channel);

  // Authorization check

  // Videos can only be created on channels owned by the author
  if (channelData.owner !== context.auth.userID) {
    throw new AuthorizationError(
      'VideoData',
      'create video in requested channel',
    );
  }

  const videoData: IVideo = {
    id: uuid(),
    author: context.auth.userID,
    channel: channelData,
    title,
    description,
    content: null,
    uploadDate: 0,
  };

  // Check # of videos
  const existingVideos = await queryVideo(context, {
    channel: channelData.id,
  });
  if (existingVideos.length >= MAX_VIDEOS) {
    throw new AuthorizationError(
      'VideoData',
      `create more than ${MAX_VIDEOS} on a channel`,
    );
  }

  // Add to DB
  const videoDoc = firestoreInstance.doc(
    toNamespaced(`videos/${videoData.id}`, appConfig.dbPrefix),
  );
  await videoDoc.set({
    id: videoData.id,
    author: videoData.author,
    channel: videoData.channel.id,
    title: videoData.title,
    description: videoData.description,
    content: null,
    uploadDate: 0,
  }); // Uses a schema form of IVideo
  return videoData;
}

/**
 * Update a video's information
 * @param context Invocation context
 * @param id ID of video to update
 * @param update Update object
 */
export async function updateVideo(
  context: IServiceInvocationContext,
  id: tID,
  update: IVideoUpdate,
) {
  // Fetch video to make sure it exists
  const videoDoc = firestoreInstance.doc(
    toNamespaced(`videos/${id}`, appConfig.dbPrefix),
  );
  const oldVideo = await getSingleVideoRecord(context, id);

  // Authorization check

  // Videos can only be updated by their author or the channel owner
  if (
    oldVideo.author !== context.auth.userID &&
    oldVideo.channel.owner !== context.auth.userID
  ) {
    throw new AuthorizationError('VideoData', 'update video');
  }

  // Update doc in DB and fetch it again
  await videoDoc.update(update);
  const newVideo = await getSingleVideoRecord(context, id);

  // Update doc in search index
  await searchService.updateVideo(context, newVideo);

  return newVideo;
}

/**
 * Deletes a video record and it's associated resources
 * @param context Invocation Context
 * @param id ID of video to delete
 */
export async function deleteVideo(context: IServiceInvocationContext, id: tID) {
  // Fetch video to make sure it exists
  const videoDoc = firestoreInstance.doc(
    toNamespaced(`videos/${id}`, appConfig.dbPrefix),
  );
  const videoData = await getSingleVideoRecord(context, id);

  // Authorization check

  // Videos can only be deleted by their author or the channel owner
  if (
    videoData.author !== context.auth.userID &&
    videoData.channel.owner !== context.auth.userID
  ) {
    throw new AuthorizationError('VideoData', 'delete video');
  }

  // Delete from search index
  await searchService.removeVideo(context, videoData);

  // Delete content if it exists
  if (videoData.content) {
    await videoContentService.deleteVideo(context, videoData.content.id);

    // Also delete watchtime data
    await watchtimeService.clearVideo(context, videoData.id);
  }

  // Delete from firestore
  await videoDoc.delete();
}
