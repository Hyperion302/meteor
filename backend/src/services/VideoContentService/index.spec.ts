import * as videoContentService from './';
import { IVideoContent } from './definitions';
import { ObjectReadableMock, ObjectWritableMock } from 'stream-mock';
import { IServiceInvocationContext } from '@/definitions';
import moxios from 'moxios';
import { IVideo } from '@services/VideoDataService/definitions';
import {
  fakeContext,
  fakeContent,
  fakeVideo,
  fakeIDs,
  fakeContentSchema,
} from '@/sharedTestData';
import { ResourceNotFoundError } from '@/errors';

const sharedInstances = require('@/sharedInstances');
jest.mock('@/sharedInstances');

const VideoDataService = require('@services/VideoDataService');
jest.mock('@services/VideoDataService');

const db = require('./db');
jest.mock('./db');

function mockImplementations() {
  // Mock DB
  db.mockResponse.mockReturnValue([fakeContentSchema]);

  // Mock video data
  VideoDataService.getVideo.mockReturnValue(fakeVideo);

  // Mock ID
  sharedInstances.mockID.mockReturnValue(fakeIDs[0]);
}

beforeAll(() => {
  mockImplementations();
});

beforeEach(() => {
  jest.clearAllMocks();
});

describe('Video Content Service', () => {
  describe('getVideo', () => {
    it('Executes the correct query', async () => {
      await videoContentService.getVideo(fakeContext, fakeContent.id);

      expect(db.mockSelect).toHaveBeenCalledWith('*'); // Correct fields
      expect(db.mockFrom).toHaveBeenCalledWith('content'); // Correct table
      expect(db.mockWhere).toHaveBeenCalledWith('id', fakeContent.id); // Correct query
    });
    it("Fails if the content doesn't exist", () => {
      db.mockResponse.mockReturnValueOnce([]);
      const promise = videoContentService.getVideo(fakeContext, fakeContent.id);

      return expect(promise).rejects.toEqual(
        new ResourceNotFoundError(
          'VideoContent',
          'videoContent',
          fakeContent.id,
        ),
      );
    });
    it('Responds with the correct content record', async () => {
      const res = await videoContentService.getVideo(
        fakeContext,
        fakeContent.id,
      );

      expect(res).toEqual(fakeContent);
    });
  });
  describe('uploadVideo', () => {
    const testMime = 'video/mp4';

    beforeEach(() => {
      // Setup Moxios
      moxios.install();
      moxios.stubRequest('https://api.mux.com/video/v1/assets', {
        status: 200,
      });
    });

    afterEach(() => {
      // Teardown Moxios
      moxios.uninstall();
      // Reset the writable
      sharedInstances.mockedWriteStream = new ObjectWritableMock();
    });

    it('References the correct bucket', async () => {
      const testInput = new ObjectReadableMock([0, 1, 2, 3, 4]);
      await videoContentService.uploadVideo(
        fakeContext,
        fakeIDs[0],
        testInput,
        testMime,
      );

      expect(sharedInstances.mockBucket).toBeCalledWith(
        sharedInstances.mockConfig().bucket,
      );
    });
    it('References the correct file path', async () => {
      const testInput = new ObjectReadableMock([0, 1, 2, 3, 4]);
      await videoContentService.uploadVideo(
        fakeContext,
        fakeIDs[0],
        testInput,
        testMime,
      );

      expect(sharedInstances.mockFile).toBeCalledWith(
        `masters/${fakeContext.auth.userID}/${fakeIDs[0]}`,
      );
    });
    it('Creates a writestream with the correct parameters', async () => {
      const testInput = new ObjectReadableMock([0, 1, 2, 3, 4]);
      await videoContentService.uploadVideo(
        fakeContext,
        fakeIDs[0],
        testInput,
        testMime,
      );

      expect(sharedInstances.mockCreateWriteStream).toHaveBeenCalledWith({
        metadata: {
          contentType: testMime,
        },
      });
    });
    it('Makes the uploaded file public', async () => {
      const testInput = new ObjectReadableMock([0, 1, 2, 3, 4]);
      await videoContentService.uploadVideo(
        fakeContext,
        fakeIDs[0],
        testInput,
        testMime,
      );

      expect(sharedInstances.mockMakePublic).toHaveBeenCalled();
    });
    it('Sends transcoding request to Mux', (done) => {
      const testInput = new ObjectReadableMock([0, 1, 2, 3, 4]);
      videoContentService
        .uploadVideo(fakeContext, fakeIDs[0], testInput, testMime)
        .then(() => {
          moxios.wait(() => {
            const request = moxios.requests.mostRecent();
            expect(request.config.method).toEqual('post');
            expect(request.config.data).toMatchInlineSnapshot(
              `"{\\"input\\":\\"https://storage.googleapis.com/dev-swish/masters/73946096308584448/73878773241479168\\",\\"playback_policy\\":[\\"public\\"],\\"passthrough\\":\\"73878773241479168:73878773241479168\\"}"`,
            );
            done();
          });
        });
    });
  });
  describe('deleteVideo', () => {
    beforeEach(() => {
      // Setup Moxios
      moxios.install();
      moxios.stubRequest(/https\:\/\/api\.mux\.com\/video\/v1\/assets\/.*/, {
        status: 204,
      });
    });

    afterEach(() => {
      // Teardown Moxios
      moxios.uninstall();
    });
    it("Fails if the content record doesn't exist", () => {
      db.mockResponse.mockReturnValueOnce([]);
      const promise = videoContentService.deleteVideo(
        fakeContext,
        fakeContent.id,
      );

      return expect(promise).rejects.toEqual(
        new ResourceNotFoundError(
          'VideoContent',
          'videoContent',
          fakeContent.id,
        ),
      );
    });
    it('Deletes the Mux asset', (done) => {
      videoContentService.deleteVideo(fakeContext, fakeContent.id).then(() => {
        moxios.wait(() => {
          const request = moxios.requests.mostRecent();
          expect(request.url).toEqual(
            `https://api.mux.com/video/v1/assets/${fakeContent.assetID}`,
          );
          done();
        });
      });
    });
  });
});
