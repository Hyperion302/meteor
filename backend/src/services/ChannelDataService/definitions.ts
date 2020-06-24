import { tID } from '../../definitions';

/**
 * Describes a fully rendered channel
 */
export interface IChannel {
  id: tID;
  owner: string;
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
  owner?: string;
}
