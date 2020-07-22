import * as videoDataService from './';
import 'jest-extended';
import { IVideoUpdate, IVideo, IVideoSchema, IVideoQuery } from './definitions';
import { IChannel } from '@services/ChannelDataService/definitions';
import { IVideoContent } from '@services/VideoContentService/definitions';
import { IServiceInvocationContext } from '@/definitions';
import {
  fakeVideoSchema,
  fakeChannel,
  fakeContent,
  fakeContext,
  fakeIDs,
} from '@/sharedTestData';
const sharedInstances = require('@/sharedInstances');
const channelDataService = require('@services/ChannelDataService');
const videoContentService = require('@services/VideoContentService');
const searchService = require('@services/SearchService');
const watchtimeService = require('@services/WatchTimeService');

jest.mock('@/sharedInstances');
jest.mock('@services/ChannelDataService');
jest.mock('@services/VideoContentService');
jest.mock('@services/SearchService');
jest.mock('@services/WatchTimeService');

function mockImplementations() {
  // Mock firestore document
  sharedInstances.mockData.mockImplementation(() => {
    return fakeVideoSchema;
  });
  // Mock Channel
  channelDataService.getChannel.mockImplementation((id: string) => {
    return new Promise((resolve) => {
      process.nextTick(() => {
        resolve(fakeChannel);
      });
    });
  });
  // Mock Content
  videoContentService.getVideo.mockImplementation((id: string) => {
    return new Promise((resolve) => {
      process.nextTick(() => {
        resolve(fakeContent);
      });
    });
  });
  // Mock UUID
  sharedInstances.mockID.mockImplementation(() => {
    return fakeIDs[0];
  });
}

beforeAll(() => {
  mockImplementations();
});

beforeEach(() => {
  jest.clearAllMocks();
});

describe('Video Data Service', () => {
  describe('getVideo', () => {
    it('Requests the correct video ID', async () => {
      await videoDataService.getVideo(fakeContext, fakeIDs[0]);
      expect(sharedInstances.mockDoc).toBeCalledWith(
        `${sharedInstances.mockConfig().dbPrefix}videos/${fakeIDs[0]}`,
      );
    });
    it('Checks if the video exists', async () => {
      await videoDataService.getVideo(fakeContext, fakeIDs[0]);
      expect(sharedInstances.mockExists).toBeCalled();
    });
    it('Requests the correct channel ID', async () => {
      await videoDataService.getVideo(fakeContext, fakeIDs[0]);
      expect(channelDataService.getChannel).toBeCalledWith(
        fakeContext,
        fakeIDs[1],
      );
    });
    it('Requests the correct content ID', async () => {
      await videoDataService.getVideo(fakeContext, fakeIDs[0]);
      expect(videoContentService.getVideo).toBeCalledWith(
        fakeContext,
        fakeIDs[2],
      );
    });
    it('Responds with the correct video', async () => {
      const res = await videoDataService.getVideo(fakeContext, fakeIDs[0]);
      expect(res).toMatchInlineSnapshot(`
        Object {
          "author": "FDJIVPG1xgXfXmm67ETETSn9MSe2",
          "channel": Object {
            "id": "73877867791908867",
            "name": "Test Channel",
            "owner": "FDJIVPG1xgXfXmm67ETETSn9MSe2",
          },
          "content": Object {
            "assetID": "SNW1q1R01PdIkf26Kn01DIKAgYtq2qgWRo",
            "duration": 5.2,
            "id": "73877867791908866",
            "playbackID": "1ZjsLIn0167NzZ02TGbbGEngvGbMCAA00sG",
          },
          "description": "Test Video Description",
          "id": "73878773241479168",
          "title": "Test Video Name",
          "uploadDate": 1578009691,
        }
      `);
    });
  });

  describe('createVideo', () => {
    const testTitle = 'Cool vid';
    const testDescription = 'Cool video description';

    it('Fetches the videos future channel', async () => {
      await videoDataService.createVideo(
        fakeContext,
        testTitle,
        testDescription,
        fakeIDs[1],
      );

      expect(channelDataService.getChannel).toHaveBeenCalledWith(
        fakeContext,
        fakeIDs[1],
      );
    });
    it('Generates an ID for the video', async () => {
      await videoDataService.createVideo(
        fakeContext,
        testTitle,
        testDescription,
        fakeIDs[1],
      );

      expect(sharedInstances.mockID).toHaveBeenCalled();
    });
    it('References a correct path', async () => {
      await videoDataService.createVideo(
        fakeContext,
        testTitle,
        testDescription,
        fakeIDs[1],
      );

      expect(sharedInstances.mockDoc).toHaveBeenCalledWith(
        `${sharedInstances.mockConfig().dbPrefix}videos/${fakeIDs[0]}`,
      );
    });
    it('Sets the correct video data', async () => {
      await videoDataService.createVideo(
        fakeContext,
        testTitle,
        testDescription,
        fakeIDs[1],
      );

      expect(sharedInstances.mockSet).toHaveBeenCalledWith({
        id: fakeIDs[0],
        author: fakeContext.auth.userID,
        channel: fakeChannel.id,
        title: testTitle,
        description: testDescription,
        content: null,
        uploadDate: 0,
      });
    });
    it('Returns the correct video', async () => {
      const res = await videoDataService.createVideo(
        fakeContext,
        testTitle,
        testDescription,
        fakeIDs[1],
      );

      expect(res).toMatchInlineSnapshot(`
        Object {
          "author": "FDJIVPG1xgXfXmm67ETETSn9MSe2",
          "channel": Object {
            "id": "73877867791908867",
            "name": "Test Channel",
            "owner": "FDJIVPG1xgXfXmm67ETETSn9MSe2",
          },
          "content": null,
          "description": "Cool video description",
          "id": "73878773241479168",
          "title": "Cool vid",
          "uploadDate": 0,
        }
      `);
    });
  });

  describe('queryVideo', () => {
    const sampleQuery: IVideoQuery = {
      channel: '716886dd-c107-4bd7-9060-a47b50f81689',
      before: '30',
      after: '50',
      author: 'FDJIVPG1xgXfXmm67ETETSn9MSe2',
    };
    it('Fails with empty query', async () => {
      const promise = videoDataService.queryVideo(fakeContext, {});

      expect(promise).rejects.toThrow();
    });
    it('Fails with invalid query dates', async () => {
      const promise = videoDataService.queryVideo(fakeContext, {
        before: '10',
        after: '5',
      });

      expect(promise).rejects.toThrow();
    });
    it('References correct collection', async () => {
      await videoDataService.queryVideo(fakeContext, sampleQuery);

      expect(sharedInstances.mockCollection).toBeCalledWith(
        `${sharedInstances.mockConfig().dbPrefix}videos`,
      );
    });
    it("Constructs the correct query for 'after'", async () => {
      await videoDataService.queryVideo(fakeContext, sampleQuery);

      expect(sharedInstances.mockWhere).toHaveBeenCalledWith(
        'uploadDate',
        '>',
        parseInt(sampleQuery.after),
      );
    });
    it("Constructs the correct query for 'before'", async () => {
      await videoDataService.queryVideo(fakeContext, sampleQuery);

      expect(sharedInstances.mockWhere).toHaveBeenCalledWith(
        'uploadDate',
        '<',
        parseInt(sampleQuery.before),
      );
    });
    it("Constructs the correct query for 'channel'", async () => {
      await videoDataService.queryVideo(fakeContext, sampleQuery);

      expect(sharedInstances.mockWhere).toHaveBeenCalledWith(
        'channel',
        '==',
        sampleQuery.channel,
      );
    });
    it("Constructs the correct query for 'author'", async () => {
      await videoDataService.queryVideo(fakeContext, sampleQuery);

      expect(sharedInstances.mockWhere).toHaveBeenCalledWith(
        'author',
        '==',
        sampleQuery.author,
      );
    });
    it('Properly maps query responses', async () => {
      await videoDataService.queryVideo(fakeContext, sampleQuery);

      expect(sharedInstances.mockMap).toHaveBeenCalled();
    });
    it('Returns the correct data', async () => {
      const res = await videoDataService.queryVideo(fakeContext, sampleQuery);

      expect(res).toBeArray(); // Probably should test return value
    });
  });

  describe('updateVideo', () => {
    const testFullUpdate: IVideoUpdate = {
      title: 'New title',
      description: 'New description',
    };
    const testTitleUpdate: IVideoUpdate = {
      title: 'New title',
    };
    const testDescriptionUpdate: IVideoUpdate = {
      description: 'New description',
    };
    const updatedVideoSchema: IVideoSchema = {
      author: fakeVideoSchema.author,
      channel: fakeVideoSchema.channel,
      content: fakeVideoSchema.content,
      description: testFullUpdate.description,
      id: fakeVideoSchema.id,
      title: testFullUpdate.title,
      uploadDate: fakeVideoSchema.uploadDate,
    };
    const expectedUpdatedVideo: IVideo = {
      author: fakeVideoSchema.author,
      channel: fakeChannel,
      content: fakeContent,
      description: testFullUpdate.description,
      id: fakeVideoSchema.id,
      title: testFullUpdate.title,
      uploadDate: fakeVideoSchema.uploadDate,
    };
    const testBlankUpdate: IVideoUpdate = {};
    it('Checks to see if the video exists first', async () => {
      await videoDataService.updateVideo(
        fakeContext,
        fakeIDs[0],
        testFullUpdate,
      );
      expect(sharedInstances.mockExists).toBeCalled();
    });
    it('Updates the video record', async () => {
      await videoDataService.updateVideo(
        fakeContext,
        fakeIDs[0],
        testFullUpdate,
      );
      expect(sharedInstances.mockUpdate).toBeCalled();
    });
    it('Updates the correct video record', async () => {
      await videoDataService.updateVideo(
        fakeContext,
        fakeIDs[0],
        testFullUpdate,
      );
      expect(sharedInstances.mockUpdate).toBeCalledWith(testFullUpdate);
    });
    it('Only updates title if given only a title', async () => {
      await videoDataService.updateVideo(
        fakeContext,
        fakeIDs[0],
        testTitleUpdate,
      );
      expect(sharedInstances.mockUpdate).toBeCalledWith(testTitleUpdate);
    });
    it('Only updates description if given only a description', async () => {
      await videoDataService.updateVideo(
        fakeContext,
        fakeIDs[0],
        testDescriptionUpdate,
      );
      expect(sharedInstances.mockUpdate).toBeCalledWith(testDescriptionUpdate);
    });
    it('Silently performs no update if given no changes', async () => {
      await videoDataService.updateVideo(
        fakeContext,
        fakeIDs[0],
        testBlankUpdate,
      );
      expect(sharedInstances.mockUpdate).toBeCalledWith(testBlankUpdate);
    });
    it('Requests a new video record after updating', async () => {
      await videoDataService.updateVideo(
        fakeContext,
        fakeIDs[0],
        testFullUpdate,
      );
      expect(sharedInstances.mockDoc).toBeCalled();
    });
    it('Requests the correct new video record', async () => {
      await videoDataService.updateVideo(
        fakeContext,
        fakeIDs[0],
        testFullUpdate,
      );
      expect(sharedInstances.mockDoc).toHaveBeenLastCalledWith(
        `${sharedInstances.mockConfig().dbPrefix}videos/${fakeIDs[0]}`,
      );
    });
    it('Updates the search index', async () => {
      await videoDataService.updateVideo(
        fakeContext,
        fakeIDs[0],
        testFullUpdate,
      );
      expect(searchService.updateVideo).toBeCalled();
    });
    it('Updates the correct video in the search index', async () => {
      // Mock re-request
      sharedInstances.mockData.mockImplementationOnce(() => {
        return updatedVideoSchema; // Updated test video schema.  Updated with test update data
      });
      sharedInstances.mockData.mockImplementationOnce(() => {
        return updatedVideoSchema; // Updated test video schema.  Updated with test update data
      });
      await videoDataService.updateVideo(
        fakeContext,
        fakeIDs[0],
        testFullUpdate,
      );
      expect(searchService.updateVideo.mock.calls[0][1]).toMatchObject(
        expectedUpdatedVideo,
      );
    });
    it('Returns the updated video', async () => {
      // Mock re-request
      sharedInstances.mockData.mockImplementationOnce(() => {
        return updatedVideoSchema; // Updated test video schema.  Updated with test update data
      });
      sharedInstances.mockData.mockImplementationOnce(() => {
        return updatedVideoSchema; // Updated test video schema.  Updated with test update data
      });

      const res = await videoDataService.updateVideo(
        fakeContext,
        fakeIDs[0],
        testFullUpdate,
      );
      expect(res).toMatchObject(expectedUpdatedVideo);
    });
  });

  describe('deleteVideo', () => {
    it('Checks to see if the video exists first', async () => {
      await videoDataService.deleteVideo(fakeContext, fakeIDs[0]);

      expect(sharedInstances.mockDoc).toBeCalledWith(
        `${sharedInstances.mockConfig().dbPrefix}videos/${fakeIDs[0]}`,
      );

      expect(sharedInstances.mockExists).toBeCalled();
    });

    it('Deletes everything in the right order', async () => {
      await videoDataService.deleteVideo(fakeContext, fakeIDs[0]);

      expect(searchService.removeVideo).toHaveBeenCalledBefore(
        videoContentService.deleteVideo,
      ); // Search before content
      expect(videoContentService.deleteVideo).toHaveBeenCalledBefore(
        sharedInstances.mockDelete,
      ); // Content before delete
    });

    it('Deletes the search index', async () => {
      await videoDataService.deleteVideo(fakeContext, fakeIDs[0]);
      expect(searchService.removeVideo).toHaveBeenCalled();
    });

    it('Deletes the correct search index', async () => {
      await videoDataService.deleteVideo(fakeContext, fakeIDs[0]);
      expect(searchService.removeVideo.mock.calls[0][1]).toMatchInlineSnapshot(`
Object {
  "author": "FDJIVPG1xgXfXmm67ETETSn9MSe2",
  "channel": Object {
    "id": "73877867791908867",
    "name": "Test Channel",
    "owner": "FDJIVPG1xgXfXmm67ETETSn9MSe2",
  },
  "content": Object {
    "assetID": "SNW1q1R01PdIkf26Kn01DIKAgYtq2qgWRo",
    "duration": 5.2,
    "id": "73877867791908866",
    "playbackID": "1ZjsLIn0167NzZ02TGbbGEngvGbMCAA00sG",
  },
  "description": "Test Video Description",
  "id": "73878773241479168",
  "title": "Test Video Name",
  "uploadDate": 1578009691,
}
`);
    });

    it('Deletes the video content', async () => {
      await videoDataService.deleteVideo(fakeContext, fakeIDs[0]);
      expect(videoContentService.deleteVideo).toHaveBeenCalled();
    });

    it('Deletes the correct video content', async () => {
      await videoDataService.deleteVideo(fakeContext, fakeIDs[0]);
      expect(videoContentService.deleteVideo).toHaveBeenCalledWith(
        fakeContext,
        fakeIDs[2],
      );
    });

    it("Doesn't try to delete video content if it does't exist", async () => {
      sharedInstances.mockData.mockImplementation(() => {
        const retVal: {
          id: string;
          author: 'FDJIVPG1xgXfXmm67ETETSn9MSe2';
          channel: '716886dd-c107-4bd7-9060-a47b50f81689';
          content: null;
          description: 'Test Video Description';
          title: 'Test Video Name';
          uploadDate: 1578009691;
        } = {
          id: fakeIDs[0],
          author: 'FDJIVPG1xgXfXmm67ETETSn9MSe2',
          channel: '716886dd-c107-4bd7-9060-a47b50f81689',
          content: null,
          description: 'Test Video Description',
          title: 'Test Video Name',
          uploadDate: 1578009691,
        }; // Work around for TS
        return retVal;
      });
      await videoDataService.deleteVideo(fakeContext, fakeIDs[0]);
      expect(videoContentService.deleteVideo).not.toHaveBeenCalled();
    });

    it('Deletes the video record', async () => {
      await videoDataService.deleteVideo(fakeContext, fakeIDs[0]);
      expect(sharedInstances.mockDelete).toHaveBeenCalled();
    });
  });
});
