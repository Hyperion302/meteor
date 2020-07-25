import { tID, IServiceInvocationContext } from '@/definitions';
import {
  ResourceNotFoundError,
  InvalidQueryError,
  InternalError,
  AuthorizationError,
} from '@/errors';
import {
  IChannel,
  IChannelQuery,
  IChannelUpdate,
  IChannelSchema,
} from './definitions';
import * as search from '@services/SearchService';
import {
  firestoreInstance,
  appConfig,
  swishflakeGenerator,
} from '@/sharedInstances';
import { knexInstance } from './db';

// Predefined constants
export const MAX_CHANNELS: number = 10;

/**
 * Retrieves a single channel record
 * @param id ID of channel to retrieve
 * @returns Promise that resolves to the requested channel
 * @ignore
 */
async function getSingleChannelRecord(id: tID): Promise<IChannel> {
  const rows = await knexInstance
    .select('*')
    .from<IChannelSchema>('channel')
    .where('id', id);
  if (rows.length == 0) {
    throw new ResourceNotFoundError('ChannelData', 'channel', id);
  }
  if (rows.length > 1) {
    throw new InternalError(
      'ChannelData',
      'More than one channel was found with matching ID',
    );
  }
  const channelSchema = rows[0];
  return {
    id: channelSchema.id,
    owner: channelSchema.owner_id,
    name: channelSchema.name,
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
  const rows = await knexInstance
    .select('*')
    .from<IChannelSchema>('channel')
    .where('owner_id', query.owner);
  return rows.map((schema) => {
    return {
      id: schema.id,
      owner: schema.owner_id,
      name: schema.name,
    };
  });
}

/**
 * Creates a channel
 * @param name Name of channel
 * @returns Promise resolves to created channel
 */
export async function createChannel(
  context: IServiceInvocationContext,
  name: string,
): Promise<IChannel> {
  // Build channel object
  const channelData: IChannel = {
    id: swishflakeGenerator.nextID(),
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
  await knexInstance.table<IChannelSchema>('channel').insert({
    id: channelData.id,
    owner_id: channelData.owner,
    name: channelData.name,
  });
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
  const oldChannel = await getSingleChannelRecord(id);

  // Authorization Check
  // Channels can only be updated by the owner
  console.log(oldChannel);
  if (context.auth.userID !== oldChannel.owner) {
    throw new AuthorizationError('ChannelData', 'update channel');
  }

  // Check if empty update
  if (!update.name) {
    return oldChannel;
  }

  // Update record in DB and fetch again
  await knexInstance
    .table<IChannelSchema>('channel')
    .where('id', id)
    .update(update);
  // FIXME: Could probably use the output of the DB update instead of a refetch
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
  const channelData = await getSingleChannelRecord(id);

  // Authorization Check
  // Channels can only be deleted by the owner
  if (context.auth.userID !== channelData.owner) {
    throw new AuthorizationError('ChannelData', 'delete channel');
  }

  // Remove from search index
  await search.removeChannel(context, channelData);

  // Remove from DB
  await knexInstance
    .table('channel')
    .where('id', id)
    .del();
}
