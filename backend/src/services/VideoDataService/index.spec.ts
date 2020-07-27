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
  fakeVideo,
} from '@/sharedTestData';
import { ResourceNotFoundError, InvalidQueryError } from '@/errors';
const sharedInstances = require('@/sharedInstances');
jest.mock('@/sharedInstances');

const channelDataService = require('@services/ChannelDataService');
jest.mock('@services/ChannelDataService');

const videoContentService = require('@services/VideoContentService');
jest.mock('@services/VideoContentService');

const searchService = require('@services/SearchService');
jest.mock('@services/SearchService');

const watchtimeService = require('@services/WatchTimeService');
jest.mock('@services/WatchTimeService');

const db = require('./db');
jest.mock('./db');

function mockImplementations() {
  // Mock firestore document
  db.mockResponse.mockReturnValue([fakeVideoSchema]);
  // Mock Channel
  channelDataService.getChannel.mockResolvedValue(fakeChannel);
  // Mock Content
  videoContentService.getVideo.mockResolvedValue(fakeContent);
  // Mock ID
  sharedInstances.mockID.mockReturnValue(fakeIDs[0]);
}

beforeAll(() => {
  mockImplementations();
});

beforeEach(() => {
  jest.clearAllMocks();
});

describe('Video Data Service', () => {
  describe('getVideo', () => {
    it('Executes the correct query', async () => {
      await videoDataService.getVideo(fakeContext, fakeIDs[0]);
      expect(db.mockSelect).toHaveBeenCalledWith('*'); // Correct fields
      expect(db.mockFrom).toHaveBeenCalledWith('video'); // Correct table
      expect(db.mockWhere).toHaveBeenCalledWith('id', fakeIDs[0]); // Correct video
    });
    it('Fails if the video does not exist', () => {
      db.mockResponse.mockReturnValueOnce([]);
      const promise = videoDataService.getVideo(fakeContext, fakeIDs[0]);
      return expect(promise).rejects.toEqual(
        new ResourceNotFoundError('VideoData', 'video', fakeIDs[0]),
      );
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
      expect(res).toEqual(fakeVideo);
    });
  });

  describe('createVideo', () => {
    const testTitle = 'Cool vid';
    const testDescription = 'Cool video description';

    const expectedNewSchema: Partial<IVideoSchema> = {
      id: fakeIDs[0],
      channel_id: fakeIDs[1],
      author_id: fakeContext.auth.userID,
      description: testDescription,
      title: testTitle,
      content_id: null,
    };
    const expectedNewVideo: IVideo = {
      id: fakeIDs[0],
      channel: fakeChannel,
      author: fakeContext.auth.userID,
      title: testTitle,
      description: testDescription,
      content: null,
    };

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
    it('Executes the correct query', async () => {
      await videoDataService.createVideo(
        fakeContext,
        testTitle,
        testDescription,
        fakeIDs[1],
      );

      expect(db.mockTable).toHaveBeenCalledWith('video');
      expect(db.mockInsert).toHaveBeenCalledWith(expectedNewSchema);
    });
    it('Returns the new video', async () => {
      const res = await videoDataService.createVideo(
        fakeContext,
        testTitle,
        testDescription,
        fakeIDs[1],
      );

      expect(res).toEqual(expectedNewVideo);
    });
  });

  describe('queryVideo', () => {
    const sampleQuery: IVideoQuery = {
      channel: fakeIDs[1],
      before: 1595771074,
      after: 1595771065,
      author: fakeContext.auth.userID,
    };
    it('Fails with empty query', () => {
      const promise = videoDataService.queryVideo(fakeContext, {});

      return expect(promise).rejects.toEqual(
        new InvalidQueryError('VideoData', {}),
      );
    });
    it('Fails with impossible query dates', () => {
      const promise = videoDataService.queryVideo(fakeContext, {
        before: 1595771065,
        after: 1595771074,
      });

      return expect(promise).rejects.toEqual(
        new InvalidQueryError('VideoData', {
          before: 1595771065,
          after: 1595771074,
        }),
      );
    });
    it('Executes the correct query', async () => {
      await videoDataService.queryVideo(fakeContext, sampleQuery);

      expect(db.mockSelect).toHaveBeenCalledWith('*');
      expect(db.mockFrom).toHaveBeenCalledWith('video');
      expect(db.mockWhere).toHaveBeenCalledWith(
        'channel_id',
        sampleQuery.channel,
      );
      expect(db.mockAndWhere).toHaveBeenCalledWith(
        'author_id',
        sampleQuery.author,
      );
      expect(db.mockAndWhereBetween).toHaveBeenCalledWith('created_at', [
        new Date().setTime(sampleQuery.before),
        new Date().setTime(sampleQuery.after),
      ]);
    });
    it('Returns the correct data', async () => {
      const res = await videoDataService.queryVideo(fakeContext, sampleQuery);

      expect(res).toBeArrayOfSize(1); // Probably should test return value
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
      author_id: fakeVideoSchema.author_id,
      channel_id: fakeVideoSchema.channel_id,
      content_id: fakeVideoSchema.content_id,
      description: testFullUpdate.description,
      id: fakeVideoSchema.id,
      title: testFullUpdate.title,
      created_at: null,
    };
    const expectedUpdatedVideo: IVideo = {
      author: fakeVideoSchema.author_id,
      channel: fakeChannel,
      content: fakeContent,
      description: testFullUpdate.description,
      id: fakeVideoSchema.id,
      title: testFullUpdate.title,
    };
    const testBlankUpdate: IVideoUpdate = {};
    it('Fails if video does not exist', () => {
      db.mockResponse.mockReturnValueOnce([]);
      const promise = videoDataService.updateVideo(
        fakeContext,
        fakeIDs[0],
        testFullUpdate,
      );
      return expect(promise).rejects.toEqual(
        new ResourceNotFoundError('VideoData', 'video', fakeIDs[0]),
      );
    });
    it('Executes the correct query given a full update', async () => {
      await videoDataService.updateVideo(
        fakeContext,
        fakeIDs[0],
        testFullUpdate,
      );
      expect(db.mockTable).toHaveBeenCalledWith('video');
      expect(db.mockWhere).toHaveBeenCalledWith('id', fakeIDs[0]);
      expect(db.mockUpdate).toHaveBeenCalledWith(testFullUpdate);
    });
    it('Executes the correct query given only a title', async () => {
      await videoDataService.updateVideo(
        fakeContext,
        fakeIDs[0],
        testTitleUpdate,
      );
      expect(db.mockTable).toHaveBeenCalledWith('video');
      expect(db.mockWhere).toHaveBeenCalledWith('id', fakeIDs[0]);
      expect(db.mockUpdate).toHaveBeenCalledWith(testTitleUpdate);
    });
    it('Executes the correct query given only a description', async () => {
      await videoDataService.updateVideo(
        fakeContext,
        fakeIDs[0],
        testDescriptionUpdate,
      );
      expect(db.mockTable).toHaveBeenCalledWith('video');
      expect(db.mockWhere).toHaveBeenCalledWith('id', fakeIDs[0]);
      expect(db.mockUpdate).toHaveBeenCalledWith(testDescriptionUpdate);
    });
    it('Executes no query given no changes', async () => {
      await videoDataService.updateVideo(
        fakeContext,
        fakeIDs[0],
        testBlankUpdate,
      );
      expect(db.mockUpdate).not.toHaveBeenCalled();
      expect(searchService.updateVideo).not.toHaveBeenCalled();
    });
    it('Updates the search index', async () => {
      db.mockResponse.mockReturnValueOnce([fakeVideo]);
      db.mockResponse.mockReturnValueOnce([]);
      db.mockResponse.mockReturnValueOnce([updatedVideoSchema]);

      await videoDataService.updateVideo(
        fakeContext,
        fakeIDs[0],
        testFullUpdate,
      );
      expect(searchService.updateVideo.mock.calls[0][1]).toEqual(
        expectedUpdatedVideo,
      );
    });
    it('Returns the updated video', async () => {
      db.mockResponse.mockReturnValueOnce([fakeVideo]);
      db.mockResponse.mockReturnValueOnce([]);
      db.mockResponse.mockReturnValueOnce([updatedVideoSchema]);

      const res = await videoDataService.updateVideo(
        fakeContext,
        fakeIDs[0],
        testFullUpdate,
      );
      expect(res).toEqual(expectedUpdatedVideo);
    });
  });

  describe('updateContent', () => {
    it('Fails if the video does not exist', () => {
      db.mockResponse.mockReturnValueOnce([]);

      const promise = videoDataService.updateContent(
        null,
        fakeIDs[0],
        fakeIDs[2],
      );
      return expect(promise).rejects.toEqual(
        new ResourceNotFoundError('VideoData', 'video', fakeIDs[0]),
      );
    });
    it('Executes the correct update query', async () => {
      await videoDataService.updateContent(null, fakeIDs[0], fakeIDs[2]);

      expect(db.mockTable).toHaveBeenCalledWith('video');
      expect(db.mockUpdate).toHaveBeenCalledWith('content_id', fakeIDs[2]);
    });
    it('Works as expected given a null contentID', async () => {
      await videoDataService.updateContent(null, fakeIDs[0], null);

      expect(db.mockTable).toHaveBeenCalledWith('video');
      expect(db.mockUpdate).toHaveBeenCalledWith('content_id', null);
    });
  });

  describe('deleteVideo', () => {
    it('Fails if the video does not exist', () => {
      db.mockResponse.mockReturnValueOnce([]);
      const promise = videoDataService.deleteVideo(fakeContext, fakeIDs[0]);

      return expect(promise).rejects.toEqual(
        new ResourceNotFoundError('VideoData', 'video', fakeIDs[0]),
      );
    });

    it('Deletes everything in the right order', async () => {
      await videoDataService.deleteVideo(fakeContext, fakeIDs[0]);

      expect(searchService.removeVideo).toHaveBeenCalledBefore(
        videoContentService.deleteVideo,
      ); // Search before content
      expect(videoContentService.deleteVideo).toHaveBeenCalledBefore(
        db.mockDel,
      ); // Content before delete
    });
    it('Deletes the search index entry', async () => {
      await videoDataService.deleteVideo(fakeContext, fakeIDs[0]);
      expect(searchService.removeVideo.mock.calls[0][1]).toEqual(fakeVideo);
    });

    it('Deletes the video content', async () => {
      await videoDataService.deleteVideo(fakeContext, fakeIDs[0]);
      expect(videoContentService.deleteVideo).toHaveBeenCalled();
    });

    it('Deletes the watchtime data', async () => {
      await videoDataService.deleteVideo(fakeContext, fakeIDs[0]);
      expect(watchtimeService.clearVideo).toHaveBeenCalled();
    });

    it('Deletes the correct video content', async () => {
      await videoDataService.deleteVideo(fakeContext, fakeIDs[0]);
      expect(videoContentService.deleteVideo).toHaveBeenCalledWith(
        fakeContext,
        fakeIDs[2],
      );
    });

    it("Doesn't try to delete video content if it does't exist", async () => {
      db.mockResponse.mockReturnValueOnce([
        {
          ...fakeVideoSchema,
          content_id: null,
        },
      ]);
      await videoDataService.deleteVideo(fakeContext, fakeIDs[0]);
      expect(videoContentService.deleteVideo).not.toHaveBeenCalled();
    });

    it('Executes the correct delete query', async () => {
      await videoDataService.deleteVideo(fakeContext, fakeIDs[0]);

      expect(db.mockTable).toHaveBeenCalledWith('video');
      expect(db.mockWhere).toHaveBeenCalledWith('id', fakeIDs[0]);
      expect(db.mockDel).toHaveBeenCalled();
    });
  });
});
