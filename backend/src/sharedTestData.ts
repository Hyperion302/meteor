import { IServiceInvocationContext } from '@/definitions';
import {
  IChannel,
  IChannelSchema,
} from '@services/ChannelDataService/definitions';
import { IVideo, IVideoSchema } from '@services/VideoDataService/definitions';
import {
  IVideoContent,
  IVideoContentSchema,
} from '@services/VideoContentService/definitions';

export const fakeContext: IServiceInvocationContext = {
  auth: {
    elevated: false,
    userID: '73946096308584448',
    userIDInt: BigInt('73946096308584448'),
    token: null, // None of the services should be using this
  },
};

export const fakeIDs: string[] = [
  '73878773241479168', // Video
  '73877867791908867', // Channel
  '73877867791908866', // Content
];

export const fakeChannel: IChannel = {
  id: fakeIDs[1],
  name: 'Test Channel',
  owner: fakeContext.auth.userID,
};
export const fakeChannelSchema: IChannelSchema = {
  id: fakeChannel.id,
  name: fakeChannel.name,
  owner_id: fakeChannel.owner,
};

export const fakeContent: IVideoContent = {
  id: fakeIDs[2],
  assetID: 'SNW1q1R01PdIkf26Kn01DIKAgYtq2qgWRo',
  playbackID: '1ZjsLIn0167NzZ02TGbbGEngvGbMCAA00sG',
  duration: 5.2,
};
export const fakeContentSchema: IVideoContentSchema = fakeContent;

export const fakeVideo: IVideo = {
  id: fakeIDs[0],
  author: fakeContext.auth.userID,
  channel: fakeChannel,
  content: fakeContent,
  description: 'Test Video Description',
  title: 'Test Video Name',
};

export const fakeVideoSchema: IVideoSchema = {
  id: fakeIDs[0],
  author_id: fakeContext.auth.userID,
  channel_id: fakeChannel.id,
  content_id: fakeContent.id,
  description: 'Test Video Description',
  title: 'Test Video Name',
  created_at: new Date().getTime(),
};
