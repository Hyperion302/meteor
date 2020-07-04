import * as SearchService from './';
import { IChannel } from '@services/ChannelDataService/definitions';
import { IVideo } from '@services/VideoDataService/definitions';
import { IServiceInvocationContext } from '@/definitions';
import { fakeContext, fakeVideo, fakeChannel } from '@/sharedTestData';

const sharedInstances = require('@/sharedInstances');

jest.mock('@/sharedInstances');

function mockImplementations() {
  // No implementation mocks required
}

beforeAll(() => {
  mockImplementations();
});

beforeEach(() => {
  jest.clearAllMocks();
});

describe('Search Service', () => {
  describe('addVideo', () => {
    it('Saves video object in Algolia', async () => {
      await SearchService.addVideo(fakeContext, fakeVideo);

      expect(sharedInstances.mockSaveObject.mock.calls[0][0])
        .toMatchInlineSnapshot(`
        Object {
          "description": "Test Video Description",
          "objectID": "3d1afd2a-04a2-47f9-9c65-e34b6465b83a",
          "title": "Test Video Name",
          "type": "video",
          "uploadDate": 1578009691,
          "watchtime": 0,
        }
      `);
    });
  });
  describe('updateVideo', () => {
    it('Saves video object in Algolia', async () => {
      await SearchService.updateVideo(fakeContext, fakeVideo);

      expect(sharedInstances.mockSaveObject.mock.calls[0][0])
        .toMatchInlineSnapshot(`
        Object {
          "description": "Test Video Description",
          "objectID": "3d1afd2a-04a2-47f9-9c65-e34b6465b83a",
          "title": "Test Video Name",
          "type": "video",
          "uploadDate": 1578009691,
          "watchtime": 0,
        }
      `);
    });
  });
  describe('removeVideo', () => {
    it('Removes video object from Algolia', async () => {
      await SearchService.removeVideo(fakeContext, fakeVideo);

      expect(sharedInstances.mockDeleteObject).toHaveBeenCalledWith(
        fakeVideo.id,
      );
    });
  });

  describe('addChannel', () => {
    it('Saves channel object in Algolia', async () => {
      await SearchService.addChannel(fakeContext, fakeChannel);

      expect(sharedInstances.mockSaveObject.mock.calls[0][0])
        .toMatchInlineSnapshot(`
Object {
  "name": "Test Channel",
  "objectID": "716886dd-c107-4bd7-9060-a47b50f81689",
  "type": "channel",
}
`);
    });
  });
  describe('updateChannel', () => {
    it('Saves channel object in Algolia', async () => {
      await SearchService.updateChannel(fakeContext, fakeChannel);

      expect(sharedInstances.mockSaveObject.mock.calls[0][0])
        .toMatchInlineSnapshot(`
Object {
  "name": "Test Channel",
  "objectID": "716886dd-c107-4bd7-9060-a47b50f81689",
  "type": "channel",
}
`);
    });
  });
  describe('removeChannel', () => {
    it('Removes channel object from Algolia', async () => {
      await SearchService.removeChannel(fakeContext, fakeChannel);

      expect(sharedInstances.mockDeleteObject).toHaveBeenCalledWith(
        fakeChannel.id,
      );
    });
  });
});
