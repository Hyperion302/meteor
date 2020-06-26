import { tID } from '../../definitions';

/**
 * Describes a video content record.  Holds Mux ids required for playback and/or asset manipulation.
 */
export interface IVideoContent {
  id: tID;
  assetID: string;
  playbackID: string;
  duration: number;
}

export interface IMuxAssetReadyEvent {
  type: 'ready';
  videoID: tID; // Passthrough value
  contentID: tID; // Passthrough value
  duration: number;
  assetID: string;
  playbackID: string;
  environment: {
    name: string;
    id: string;
  };
}

export interface IMuxAssetDeletedEvent {
  type: 'deleted';
  videoID: tID; // Passthrough value
  contentID: tID; // Passthrough value
  assetID: string;
  environment: {
    name: string;
    id: string;
  };
}
