import * as videoContentService from './';
import { IVideoContent } from './definitions';
import { ObjectReadableMock, ObjectWritableMock } from 'stream-mock';
import { IServiceInvocationContext } from '@/definitions';
import moxios from 'moxios';
import { IVideo } from '@services/VideoDataService/definitions';
import { fakeContext, fakeContent, fakeVideo, fakeIDs } from '@/sharedTestData';

const uuid = require('uuid/v4');
const sharedInstances = require('@/sharedInstances');
const VideoDataService = require('@services/VideoDataService');

jest.mock('@/sharedInstances');
jest.mock('@services/VideoDataService');

function mockImplementations() {
  // Mock firestore document
  sharedInstances.mockData.mockImplementation(() => fakeContent);

  // Mock video
  VideoDataService.getVideo.mockImplementation(() => fakeVideo);

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

describe('Video Content Service', () => {
  describe('getVideo', () => {
    it('Requests the correct content record', async () => {
      await videoContentService.getVideo(fakeContext, fakeContent.id);

      expect(sharedInstances.mockDoc).toHaveBeenCalledWith(
        `${sharedInstances.mockConfig().dbPrefix}content/${fakeContent.id}`,
      );
    });
    it('Checks to see if the content record exists', async () => {
      await videoContentService.getVideo(fakeContext, fakeContent.id);

      expect(sharedInstances.mockExists).toHaveBeenCalled();
    });
    it('Responds with the correct content data', async () => {
      const res = await videoContentService.getVideo(
        fakeContext,
        fakeContent.id,
      );

      expect(res).toMatchInlineSnapshot(`
        Object {
          "assetID": "SNW1q1R01PdIkf26Kn01DIKAgYtq2qgWRo",
          "duration": 5.2,
          "id": "73877867791908866",
          "playbackID": "1ZjsLIn0167NzZ02TGbbGEngvGbMCAA00sG",
        }
      `);
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
              `"{\\"input\\":\\"https://storage.googleapis.com/dev-swish/masters/FDJIVPG1xgXfXmm67ETETSn9MSe2/73878773241479168\\",\\"playback_policy\\":[\\"public\\"],\\"passthrough\\":\\"73878773241479168:73878773241479168\\"}"`,
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
    it('Checks if the content record exists', async () => {
      await videoContentService.deleteVideo(fakeContext, fakeContent.id);

      expect(sharedInstances.mockDoc).toHaveBeenCalledWith(
        `${sharedInstances.mockConfig().dbPrefix}content/${fakeContent.id}`,
      );
      expect(sharedInstances.mockExists).toHaveBeenCalled();
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
