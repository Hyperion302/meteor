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

export const fakeChannel: IChannel = {
  id: '716886dd-c107-4bd7-9060-a47b50f81689',
  name: 'Test Channel',
  owner: 'FDJIVPG1xgXfXmm67ETETSn9MSe2',
};

export const fakeContent: IVideoContent = {
  id: 'b5263a52-1c05-4ab7-813d-65b8866bacfd',
  assetID: 'SNW1q1R01PdIkf26Kn01DIKAgYtq2qgWRo',
  playbackID: '1ZjsLIn0167NzZ02TGbbGEngvGbMCAA00sG',
  duration: 5.2,
};

export const fakeVideo: IVideo = {
  id: '3d1afd2a-04a2-47f9-9c65-e34b6465b83a',
  author: 'FDJIVPG1xgXfXmm67ETETSn9MSe2',
  channel: fakeChannel,
  content: fakeContent,
  description: 'Test Video Description',
  title: 'Test Video Name',
  uploadDate: 1578009691,
};

export const fakeVideoSchema: IVideoSchema = {
  id: '3d1afd2a-04a2-47f9-9c65-e34b6465b83a',
  author: 'FDJIVPG1xgXfXmm67ETETSn9MSe2',
  channel: fakeChannel.id,
  content: fakeContent.id,
  description: 'Test Video Description',
  title: 'Test Video Name',
  uploadDate: 1578009691,
};
