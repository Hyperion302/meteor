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
} from '@/sharedTestData';
const sharedInstances = require('@/sharedInstances');
const channelDataService = require('@services/ChannelDataService');
const videoContentService = require('@services/VideoContentService');
const searchService = require('@services/SearchService');
const uuid = require('uuid/v4');

jest.mock('@/sharedInstances');
jest.mock('@services/ChannelDataService');
jest.mock('@services/VideoContentService');
jest.mock('@services/SearchService');
jest.mock('uuid/v4');

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
  uuid.mockImplementation(() => {
    return '3d1afd2a-04a2-47f9-9c65-e34b6465b83a';
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
      await videoDataService.getVideo(
        fakeContext,
        '3d1afd2a-04a2-47f9-9c65-e34b6465b83a',
      );
      expect(sharedInstances.mockDoc).toBeCalledWith(
        `${
          sharedInstances.mockConfig().dbPrefix
        }videos/3d1afd2a-04a2-47f9-9c65-e34b6465b83a`,
      );
    });
    it('Checks if the video exists', async () => {
      await videoDataService.getVideo(
        fakeContext,
        '3d1afd2a-04a2-47f9-9c65-e34b6465b83a',
      );
      expect(sharedInstances.mockExists).toBeCalled();
    });
    it('Requests the correct channel ID', async () => {
      await videoDataService.getVideo(
        fakeContext,
        '3d1afd2a-04a2-47f9-9c65-e34b6465b83a',
      );
      expect(channelDataService.getChannel).toBeCalledWith(
        fakeContext,
        '716886dd-c107-4bd7-9060-a47b50f81689',
      );
    });
    it('Requests the correct content ID', async () => {
      await videoDataService.getVideo(
        fakeContext,
        '3d1afd2a-04a2-47f9-9c65-e34b6465b83a',
      );
      expect(videoContentService.getVideo).toBeCalledWith(
        fakeContext,
        'b5263a52-1c05-4ab7-813d-65b8866bacfd',
      );
    });
    it('Responds with the correct video', async () => {
      const res = await videoDataService.getVideo(
        fakeContext,
        '3d1afd2a-04a2-47f9-9c65-e34b6465b83a',
      );
      expect(res).toMatchInlineSnapshot(`
        Object {
          "author": "FDJIVPG1xgXfXmm67ETETSn9MSe2",
          "channel": Object {
            "id": "716886dd-c107-4bd7-9060-a47b50f81689",
            "name": "Test Channel",
            "owner": "FDJIVPG1xgXfXmm67ETETSn9MSe2",
          },
          "content": Object {
            "assetID": "SNW1q1R01PdIkf26Kn01DIKAgYtq2qgWRo",
            "duration": 5.2,
            "id": "b5263a52-1c05-4ab7-813d-65b8866bacfd",
            "playbackID": "1ZjsLIn0167NzZ02TGbbGEngvGbMCAA00sG",
          },
          "description": "Test Video Description",
          "id": "3d1afd2a-04a2-47f9-9c65-e34b6465b83a",
          "title": "Test Video Name",
          "uploadDate": 1578009691,
        }
      `);
    });
  });

  describe('createVideo', () => {
    const testTitle = 'Cool vid';
    const testDescription = 'Cool video description';
    const fakeChannel = '716886dd-c107-4bd7-9060-a47b50f81689';

    it('Fetches the videos future channel', async () => {
      await videoDataService.createVideo(
        fakeContext,
        testTitle,
        testDescription,
        fakeChannel,
      );

      expect(channelDataService.getChannel).toHaveBeenCalledWith(
        fakeContext,
        fakeChannel,
      );
    });
    it('Generates a UUID for the video', async () => {
      await videoDataService.createVideo(
        fakeContext,
        testTitle,
        testDescription,
        fakeChannel,
      );

      expect(uuid).toHaveBeenCalled();
    });
    it('References a correct path', async () => {
      await videoDataService.createVideo(
        fakeContext,
        testTitle,
        testDescription,
        fakeChannel,
      );

      expect(sharedInstances.mockDoc).toHaveBeenCalledWith(
        `${
          sharedInstances.mockConfig().dbPrefix
        }videos/3d1afd2a-04a2-47f9-9c65-e34b6465b83a`,
      );
    });
    it('Sets the correct video data', async () => {
      await videoDataService.createVideo(
        fakeContext,
        testTitle,
        testDescription,
        fakeChannel,
      );

      expect(sharedInstances.mockSet).toHaveBeenCalledWith({
        id: '3d1afd2a-04a2-47f9-9c65-e34b6465b83a',
        author: fakeContext.auth.userID,
        channel: fakeChannel,
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
        fakeChannel,
      );

      expect(res).toMatchInlineSnapshot(`
                Object {
                  "author": "FDJIVPG1xgXfXmm67ETETSn9MSe2",
                  "channel": Object {
                    "id": "716886dd-c107-4bd7-9060-a47b50f81689",
                    "name": "Test Channel",
                    "owner": "FDJIVPG1xgXfXmm67ETETSn9MSe2",
                  },
                  "content": null,
                  "description": "Cool video description",
                  "id": "3d1afd2a-04a2-47f9-9c65-e34b6465b83a",
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
        '3d1afd2a-04a2-47f9-9c65-e34b6465b83a',
        testFullUpdate,
      );
      expect(sharedInstances.mockExists).toBeCalled();
    });
    it('Updates the video record', async () => {
      await videoDataService.updateVideo(
        fakeContext,
        '3d1afd2a-04a2-47f9-9c65-e34b6465b83a',
        testFullUpdate,
      );
      expect(sharedInstances.mockUpdate).toBeCalled();
    });
    it('Updates the correct video record', async () => {
      await videoDataService.updateVideo(
        fakeContext,
        '3d1afd2a-04a2-47f9-9c65-e34b6465b83a',
        testFullUpdate,
      );
      expect(sharedInstances.mockUpdate).toBeCalledWith(testFullUpdate);
    });
    it('Only updates title if given only a title', async () => {
      await videoDataService.updateVideo(
        fakeContext,
        '3d1afd2a-04a2-47f9-9c65-e34b6465b83a',
        testTitleUpdate,
      );
      expect(sharedInstances.mockUpdate).toBeCalledWith(testTitleUpdate);
    });
    it('Only updates description if given only a description', async () => {
      await videoDataService.updateVideo(
        fakeContext,
        '3d1afd2a-04a2-47f9-9c65-e34b6465b83a',
        testDescriptionUpdate,
      );
      expect(sharedInstances.mockUpdate).toBeCalledWith(testDescriptionUpdate);
    });
    it('Silently performs no update if given no changes', async () => {
      await videoDataService.updateVideo(
        fakeContext,
        '3d1afd2a-04a2-47f9-9c65-e34b6465b83a',
        testBlankUpdate,
      );
      expect(sharedInstances.mockUpdate).toBeCalledWith(testBlankUpdate);
    });
    it('Requests a new video record after updating', async () => {
      await videoDataService.updateVideo(
        fakeContext,
        '3d1afd2a-04a2-47f9-9c65-e34b6465b83a',
        testFullUpdate,
      );
      expect(sharedInstances.mockDoc).toBeCalled();
    });
    it('Requests the correct new video record', async () => {
      await videoDataService.updateVideo(
        fakeContext,
        '3d1afd2a-04a2-47f9-9c65-e34b6465b83a',
        testFullUpdate,
      );
      expect(sharedInstances.mockDoc).toHaveBeenLastCalledWith(
        `${
          sharedInstances.mockConfig().dbPrefix
        }videos/3d1afd2a-04a2-47f9-9c65-e34b6465b83a`,
      );
    });
    it('Updates the search index', async () => {
      await videoDataService.updateVideo(
        fakeContext,
        '3d1afd2a-04a2-47f9-9c65-e34b6465b83a',
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
        '3d1afd2a-04a2-47f9-9c65-e34b6465b83a',
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
        '3d1afd2a-04a2-47f9-9c65-e34b6465b83a',
        testFullUpdate,
      );
      expect(res).toMatchObject(expectedUpdatedVideo);
    });
  });

  describe('deleteVideo', () => {
    it('Checks to see if the video exists first', async () => {
      await videoDataService.deleteVideo(
        fakeContext,
        '3d1afd2a-04a2-47f9-9c65-e34b6465b83a',
      );

      expect(sharedInstances.mockDoc).toBeCalledWith(
        `${
          sharedInstances.mockConfig().dbPrefix
        }videos/3d1afd2a-04a2-47f9-9c65-e34b6465b83a`,
      );

      expect(sharedInstances.mockExists).toBeCalled();
    });

    it('Deletes everything in the right order', async () => {
      await videoDataService.deleteVideo(
        fakeContext,
        '3d1afd2a-04a2-47f9-9c65-e34b6465b83a',
      );

      expect(searchService.removeVideo).toHaveBeenCalledBefore(
        videoContentService.deleteVideo,
      ); // Search before content
      expect(videoContentService.deleteVideo).toHaveBeenCalledBefore(
        sharedInstances.mockDelete,
      ); // Content before delete
    });

    it('Deletes the search index', async () => {
      await videoDataService.deleteVideo(
        fakeContext,
        '3d1afd2a-04a2-47f9-9c65-e34b6465b83a',
      );
      expect(searchService.removeVideo).toHaveBeenCalled();
    });

    it('Deletes the correct search index', async () => {
      await videoDataService.deleteVideo(
        fakeContext,
        '3d1afd2a-04a2-47f9-9c65-e34b6465b83a',
      );
      expect(searchService.removeVideo.mock.calls[0][1]).toMatchInlineSnapshot(`
Object {
  "author": "FDJIVPG1xgXfXmm67ETETSn9MSe2",
  "channel": Object {
    "id": "716886dd-c107-4bd7-9060-a47b50f81689",
    "name": "Test Channel",
    "owner": "FDJIVPG1xgXfXmm67ETETSn9MSe2",
  },
  "content": Object {
    "assetID": "SNW1q1R01PdIkf26Kn01DIKAgYtq2qgWRo",
    "duration": 5.2,
    "id": "b5263a52-1c05-4ab7-813d-65b8866bacfd",
    "playbackID": "1ZjsLIn0167NzZ02TGbbGEngvGbMCAA00sG",
  },
  "description": "Test Video Description",
  "id": "3d1afd2a-04a2-47f9-9c65-e34b6465b83a",
  "title": "Test Video Name",
  "uploadDate": 1578009691,
}
`);
    });

    it('Deletes the video content', async () => {
      await videoDataService.deleteVideo(
        fakeContext,
        '3d1afd2a-04a2-47f9-9c65-e34b6465b83a',
      );
      expect(videoContentService.deleteVideo).toHaveBeenCalled();
    });

    it('Deletes the correct video content', async () => {
      await videoDataService.deleteVideo(
        fakeContext,
        '3d1afd2a-04a2-47f9-9c65-e34b6465b83a',
      );
      expect(videoContentService.deleteVideo).toHaveBeenCalledWith(
        fakeContext,
        'b5263a52-1c05-4ab7-813d-65b8866bacfd',
      );
    });

    it("Doesn't try to delete video content if it does't exist", async () => {
      sharedInstances.mockData.mockImplementation(() => {
        const retVal: {
          id: '3d1afd2a-04a2-47f9-9c65-e34b6465b83a';
          author: 'FDJIVPG1xgXfXmm67ETETSn9MSe2';
          channel: '716886dd-c107-4bd7-9060-a47b50f81689';
          content: null;
          description: 'Test Video Description';
          title: 'Test Video Name';
          uploadDate: 1578009691;
        } = {
          id: '3d1afd2a-04a2-47f9-9c65-e34b6465b83a',
          author: 'FDJIVPG1xgXfXmm67ETETSn9MSe2',
          channel: '716886dd-c107-4bd7-9060-a47b50f81689',
          content: null,
          description: 'Test Video Description',
          title: 'Test Video Name',
          uploadDate: 1578009691,
        }; // Work around for TS
        return retVal;
      });
      await videoDataService.deleteVideo(
        fakeContext,
        '3d1afd2a-04a2-47f9-9c65-e34b6465b83a',
      );
      expect(videoContentService.deleteVideo).not.toHaveBeenCalled();
    });

    it('Deletes the video record', async () => {
      await videoDataService.deleteVideo(
        fakeContext,
        '3d1afd2a-04a2-47f9-9c65-e34b6465b83a',
      );
      expect(sharedInstances.mockDelete).toHaveBeenCalled();
    });
  });
});
