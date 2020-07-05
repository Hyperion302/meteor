import { tID, IServiceInvocationContext } from '@/definitions';
import {
  ResourceNotFoundError,
  InvalidQueryError,
  InternalError,
  AuthorizationError,
} from '@/errors';
import uuid from 'uuid/v4';
import { IChannel, IChannelQuery, IChannelUpdate } from './definitions';
import * as search from '@services/SearchService';
import { firestoreInstance, appConfig } from '@/sharedInstances';
import { toGlobal, toNamespaced } from '@/utils';

// Predefined constants
const MAX_CHANNELS: number = 10;

/**
 * Retrieves a single channel record
 * @param id ID of channel to retrieve
 * @returns Promise that resolves to the requested channel
 * @ignore
 */
async function getSingleChannelRecord(id: tID): Promise<IChannel> {
  // Get basic channel data
  const channelDoc = firestoreInstance.doc(
    toNamespaced(`channels/${id}`, appConfig.dbPrefix),
  );
  const channelDocSnap = await channelDoc.get();
  if (!channelDocSnap.exists) {
    throw new ResourceNotFoundError('ChannelData', 'channel', id);
  }
  const channelData = channelDocSnap.data();
  // Build channel object
  return {
    id,
    owner: channelData.owner,
    name: channelData.name,
  };
}

/**
 * Retrieves a single channel
 * @param id ID of channel to return
 * @returns Promise that resolves to requested channel
 */
export async function getChannel(
  context: IServiceInvocationContext,
  id: tID,
): Promise<IChannel> {
  return await getSingleChannelRecord(id);
}

/**
 * Queries channels
 * @param query Query object to query against channels
 * @returns Promise that resolves to a list of found channels
 */
export async function queryChannel(
  context: IServiceInvocationContext,
  query: IChannelQuery,
): Promise<IChannel[]> {
  if (!query.owner) {
    // No query
    throw new InvalidQueryError('ChannelData', query);
  }
  const collection = firestoreInstance.collection(
    toNamespaced('channels', appConfig.dbPrefix),
  );
  let fsQuery;
  if (query.owner) {
    fsQuery = (fsQuery ? fsQuery : collection).where(
      'owner',
      '==',
      query.owner,
    );
  }
  if (!fsQuery) {
    throw new InternalError(
      'ChannelData',
      'fsQuery was not supposed to be undefined',
    );
  }

  // Query FS
  const querySnap = await fsQuery.get();
  const queryPromises = querySnap.docs.map((doc) => {
    return getSingleChannelRecord(doc.id);
  });

  // Wait for all to run
  const channels = await Promise.all(queryPromises);
  return channels;
}

/**
 * Creates a channel
 * @param name Name of channel
 * @param owner TEMPORARY removed with auth
 * @returns Promise resolves to created channel
 */
export async function createChannel(
  context: IServiceInvocationContext,
  name: string,
): Promise<IChannel> {
  // Build channel object
  const channelData: IChannel = {
    id: uuid(),
    owner: context.auth.userID,
    name,
  };

  // Check # of channels
  const existingChannels = await queryChannel(context, {
    owner: context.auth.userID,
  });
  if (existingChannels.length >= MAX_CHANNELS) {
    throw new AuthorizationError(
      'ChannelData',
      `create more than ${MAX_CHANNELS} channels`,
    );
  }

  // Add to search index
  await search.addChannel(context, channelData);

  // Write to DB
  const channelDoc = firestoreInstance.doc(
    toNamespaced(`channels/${channelData.id}`, appConfig.dbPrefix),
  );
  await channelDoc.set(channelData);
  return channelData;
}

/**
 * Updates a channel
 * @param context Invocation context
 * @param id ID of channel
 * @param update Update to perform
 */
export async function updateChannel(
  context: IServiceInvocationContext,
  id: tID,
  update: IChannelUpdate,
): Promise<IChannel> {
  // Fetch channel to make sure it exists
  const channelDoc = firestoreInstance.doc(
    toNamespaced(`channels/${id}`, appConfig.dbPrefix),
  );
  const oldChannel = await getSingleChannelRecord(id);

  // Authorization Check
  // Channels can only be updated by the owner
  if (context.auth.userID !== oldChannel.owner) {
    throw new AuthorizationError('ChannelData', 'update channel');
  }

  // Update doc in DB and fetch again
  await channelDoc.update(update);
  const newChannel = await getSingleChannelRecord(id);

  // Update search index
  await search.updateChannel(context, newChannel);

  return newChannel;
}

/**
 * Deletes a channel
 * @param context Invocation context
 * @param id ID of channel to delete
 */
export async function deleteChannel(
  context: IServiceInvocationContext,
  id: tID,
): Promise<void> {
  // Fetch channel to make sure it exists
  const channelDoc = firestoreInstance.doc(
    `${appConfig.dbPrefix}channels/${id}`,
  );
  const channelData = await getSingleChannelRecord(id);

  // Authorization Check
  // Channels can only be deleted by the owner
  if (context.auth.userID !== channelData.owner) {
    throw new AuthorizationError('ChannelData', 'delete channel');
  }

  // Remove from search index
  await search.removeChannel(context, channelData);

  // Remove from DB
  await channelDoc.delete();
}
