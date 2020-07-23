import { tID } from '@/definitions';

/**
 * Describes a fully rendered channel
 */
export interface IChannel {
  id: tID;
  owner: tID;
  name: string;
}

/**
 * Describes a channel in the database
 */
export interface IChannelSchema {
  id: tID;
  owner_id: tID;
  name: string;
}

/**
 * Describes a channel update
 */
export interface IChannelUpdate {
  name?: string;
}

/**
 * Describes a channel query
 */
export interface IChannelQuery {
  owner?: tID;
}
