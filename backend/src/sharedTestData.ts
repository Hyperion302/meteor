import { IServiceInvocationContext } from '@/definitions';
import { IChannel } from '@services/ChannelDataService/definitions';
import { IVideo, IVideoSchema } from '@services/VideoDataService/definitions';
import { IVideoContent } from '@services/VideoContentService/definitions';

export const fakeContext: IServiceInvocationContext = {
  auth: {
    elevated: false,
    userID: 'FDJIVPG1xgXfXmm67ETETSn9MSe2',
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
  owner: 'FDJIVPG1xgXfXmm67ETETSn9MSe2',
};

export const fakeContent: IVideoContent = {
  id: fakeIDs[2],
  assetID: 'SNW1q1R01PdIkf26Kn01DIKAgYtq2qgWRo',
  playbackID: '1ZjsLIn0167NzZ02TGbbGEngvGbMCAA00sG',
  duration: 5.2,
};

export const fakeVideo: IVideo = {
  id: fakeIDs[0],
  author: 'FDJIVPG1xgXfXmm67ETETSn9MSe2',
  channel: fakeChannel,
  content: fakeContent,
  description: 'Test Video Description',
  title: 'Test Video Name',
  uploadDate: 1578009691,
};

export const fakeVideoSchema: IVideoSchema = {
  id: fakeIDs[0],
  author: 'FDJIVPG1xgXfXmm67ETETSn9MSe2',
  channel: fakeChannel.id,
  content: fakeContent.id,
  description: 'Test Video Description',
  title: 'Test Video Name',
  uploadDate: 1578009691,
};
