import * as ChannelContentService from './';
import {
  DuplexMock,
  ObjectWritableMock,
  ObjectReadableMock,
} from 'stream-mock';
import { IServiceInvocationContext } from '@/definitions';
import { IChannel } from '@services/ChannelDataService/definitions';
import { fakeChannel, fakeContext } from '@/sharedTestData';

const sharedInstances = require('@/sharedInstances');
const ChannelDataService = require('@services/ChannelDataService');
const sharp = require('sharp');

jest.mock('@/sharedInstances');
jest.mock('@services/ChannelDataService');

function mockImplementations() {
  // Mock channel
  ChannelDataService.getChannel.mockImplementation(() => fakeChannel);
}

beforeAll(() => {
  mockImplementations();
});

beforeEach(() => {
  jest.clearAllMocks();
});

describe('Channel Content Service', () => {
  describe('uploadIcon', () => {
    const storageMetadata = {
      metadata: {
        contentType: 'image/png',
      },
    };
    it('Passes (Compressed Test)', async () => {
      const testInput = new ObjectReadableMock(['a', 'b', 'c', 'd', 'e']);
      await ChannelContentService.uploadIcon(
        fakeContext,
        fakeChannel.id,
        testInput,
      );

      // References correct bucket

      expect(sharedInstances.mockBucket).toHaveBeenNthCalledWith(
        1,
        sharedInstances.mockConfig().bucket,
      );
      expect(sharedInstances.mockBucket).toHaveBeenNthCalledWith(
        2,
        sharedInstances.mockConfig().bucket,
      );

      expect(sharedInstances.mockBucket).toHaveBeenNthCalledWith(
        3,
        sharedInstances.mockConfig().bucket,
      );

      // References correct paths

      expect(sharedInstances.mockFile).toHaveBeenNthCalledWith(
        1,
        `channelIcons/${fakeChannel.id}_128.png`,
      );
      expect(sharedInstances.mockFile).toHaveBeenNthCalledWith(
        2,
        `channelIcons/${fakeChannel.id}_64.png`,
      );
      expect(sharedInstances.mockFile).toHaveBeenNthCalledWith(
        3,
        `channelIcons/${fakeChannel.id}_32.png`,
      );

      // Creates proper write streams

      expect(sharedInstances.mockCreateWriteStream).toHaveBeenNthCalledWith(
        1,
        storageMetadata,
      );
      expect(sharedInstances.mockCreateWriteStream).toHaveBeenNthCalledWith(
        2,
        storageMetadata,
      );
      expect(sharedInstances.mockCreateWriteStream).toHaveBeenNthCalledWith(
        3,
        storageMetadata,
      );

      // Makes uploaded files public

      expect(sharedInstances.mockMakePublic).toHaveBeenCalledTimes(3);
    });
  });
});
