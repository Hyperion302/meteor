import { tID, IError, IServiceInvocationContext } from '@/definitions';
import { IVideo, IVideoQuery, IVideoSchema, IVideoUpdate } from './definitions';
import { swishflakeGenerator } from '@/sharedInstances';
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
import { knexInstance } from './db';

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
  // Get video schema
  const rows = await knexInstance
    .select('*')
    .from<IVideoSchema>('video')
    .where('id', id);
  if (rows.length === 0) {
    throw new ResourceNotFoundError('VideoData', 'video', id);
  }
  if (rows.length > 1) {
    throw new InternalError(
      'VideoData',
      `More than one video record found with ID ${id}`,
    );
  }
  const videoData = rows[0];

  // Get channel data
  const channelData = await channelDataService.getChannel(
    context,
    videoData.channel_id,
  );

  // Get content data.  If there's no content data that means there's no uploaded video data for a video
  const contentData = videoData.content_id
    ? await videoContentService.getVideo(context, videoData.content_id)
    : null;

  return {
    id,
    author: videoData.author_id,
    title: videoData.title,
    description: videoData.description,
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
  if (query.after && query.before && query.after >= query.before) {
    // Invalid dates
    throw new InvalidQueryError('VideoData', query);
  }

  // Start building query
  const queryBuilder = knexInstance.select('*').from<IVideoSchema>('video');

  // Tracks if the first where query was already called so I can call
  // the rest of them using the 'and' prefix
  let firstWhereBuilt = false;

  if (query.channel) {
    if (firstWhereBuilt) {
      queryBuilder.andWhere('channel_id', query.channel);
    } else {
      queryBuilder.where('channel_id', query.channel);
      firstWhereBuilt = true;
    }
  }
  if (query.author) {
    if (firstWhereBuilt) {
      queryBuilder.andWhere('author_id', query.author);
    } else {
      queryBuilder.where('author_id', query.author);
      firstWhereBuilt = true;
    }
  }
  if (query.before && query.after) {
    if (firstWhereBuilt) {
      queryBuilder.andWhereBetween('created_at', [
        new Date().setTime(query.before),
        new Date().setTime(query.after),
      ]);
    } else {
      queryBuilder.whereBetween('created_at', [
        new Date().setTime(query.before),
        new Date().setTime(query.after),
      ]);
      firstWhereBuilt = true;
    }
  } else if (query.before && !query.after) {
    queryBuilder.where('created_at', '<', new Date().setTime(query.before));
  } else if (query.after && !query.before) {
    queryBuilder.where('created_at', '>', new Date().setTime(query.after));
  }

  const schemaRows = await queryBuilder;

  const resolvedVideos = Promise.all(
    schemaRows.map(
      (videoSchema): Promise<IVideo> => {
        const promises: Promise<any>[] = [];
        promises.push(
          channelDataService.getChannel(context, videoSchema.channel_id),
        );
        if (videoSchema.content_id) {
          promises.push(
            videoContentService.getVideo(context, videoSchema.content_id),
          );
        } else {
          promises.push(null);
        }
        return Promise.all(promises).then(([channel, content]) => {
          return {
            id: videoSchema.id,
            author: videoSchema.author_id,
            title: videoSchema.title,
            description: videoSchema.description,
            content,
            channel,
          };
        });
      },
    ),
  );

  return resolvedVideos;
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
    id: swishflakeGenerator.nextID(),
    author: context.auth.userID,
    channel: channelData,
    title,
    description,
    content: null,
  };
  const videoSchema: Partial<IVideoSchema> = {
    id: videoData.id,
    author_id: videoData.author,
    channel_id: videoData.channel.id,
    title: videoData.title,
    description: videoData.description,
    content_id: null,
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
  await knexInstance.table<IVideoSchema>('video').insert(videoSchema);
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
  const oldVideo = await getSingleVideoRecord(context, id);

  // Authorization check
  // Videos can only be updated by their author or the channel owner
  if (
    oldVideo.author !== context.auth.userID &&
    oldVideo.channel.owner !== context.auth.userID
  ) {
    throw new AuthorizationError('VideoData', 'update video');
  }

  // Empty update check
  if (!(update.description || update.title)) {
    return;
  }

  // Update doc in DB and fetch it again
  await knexInstance
    .table<IVideoSchema>('video')
    .where('id', id)
    .update(update);
  const newVideo = await getSingleVideoRecord(context, id);

  // Update doc in search index
  await searchService.updateVideo(context, newVideo);

  return newVideo;
}

/**
 * Updates a video record to reference a new content record
 * @param context Invocation context (unused)
 * @param id ID of video to update
 * @param contentID ID of new content record
 */
export async function updateContent(
  context: IServiceInvocationContext,
  id: tID,
  contentID: tID,
) {
  await getSingleVideoRecord(context, id);

  await knexInstance
    .table<IVideoSchema>('video')
    .where('id', id)
    .update('content_id', contentID);
  return;
}

/**
 * Deletes a video record and it's associated resources
 * @param context Invocation Context
 * @param id ID of video to delete
 */
export async function deleteVideo(context: IServiceInvocationContext, id: tID) {
  // Fetch video to make sure it exists
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
  await knexInstance
    .table<IVideoSchema>('video')
    .where('id', id)
    .del();
}
