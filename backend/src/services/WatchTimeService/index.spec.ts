import * as watchTimeService from './';
import 'jest-extended';
import { IServiceInvocationContext } from '@/definitions';
import { IVideo } from '@services/VideoDataService/definitions';
const sharedInstances = require('@/sharedInstances');

jest.mock('@/sharedInstances');

const testVideo: IVideo = {
  id: '3d1afd2a-04a2-47f9-9c65-e34b6465b83a',
  author: 'FDJIVPG1xgXfXmm67ETETSn9MSe2',
  channel: {
    id: '716886dd-c107-4bd7-9060-a47b50f81689',
    name: 'Test Channel',
    owner: 'FDJIVPG1xgXfXmm67ETETSn9MSe2',
  },
  content: {
    id: 'b5263a52-1c05-4ab7-813d-65b8866bacfd',
    assetID: 'SNW1q1R01PdIkf26Kn01DIKAgYtq2qgWRo',
    playbackID: '1ZjsLIn0167NzZ02TGbbGEngvGbMCAA00sG',
    duration: 5.2,
  },
  description: 'Test Video Description',
  title: 'Test Video Name',
  uploadDate: 1578009691,
};

const mockContext: IServiceInvocationContext = {
  auth: {
    elevated: false,
    userID: 'FDJIVPG1xgXfXmm67ETETSn9MSe2',
    token: null, // None of the services should be using this
  },
};

function mockImplementations() {
  // Mock
}

describe('Watchtime Service', () => {
  describe('getSegments', () => {
    sharedInstances.mockRedisGet.mockImplementation((key: string): {
      err: any;
      reply: any;
    } => {
      return { err: null, reply: Buffer.from([160]) }; // 10100000
    });

    it('Looks up the correct key', async () => {
      await watchTimeService.getSegments(
        mockContext,
        testVideo.id,
        mockContext.auth.userID,
      );
      // Must a buffer
      expect(sharedInstances.mockRedisGet.mock.calls[0][0]).toBeInstanceOf(
        Buffer,
      );
      expect(sharedInstances.mockRedisGet).toBeCalledWith(
        Buffer.from(`${testVideo.id}:${mockContext.auth.userID}:segments`),
      );
    });

    it('Returns empty array if segments not found', async () => {
      sharedInstances.mockRedisGet.mockImplementationOnce((key: string): {
        err: any;
        reply: any;
      } => {
        return { err: null, reply: null };
      });
      const segments = await watchTimeService.getSegments(
        mockContext,
        testVideo.id,
        mockContext.auth.userID,
      );
      expect(segments).toBeArrayOfSize(0);
    });

    it('Parses out the correct segments', async () => {
      const segments = await watchTimeService.getSegments(
        mockContext,
        testVideo.id,
        mockContext.auth.userID,
      );
      expect(segments).toBeArrayOfSize(2);
      expect(segments).toEqual(
        expect.arrayContaining([{ index: 0 }, { index: 2 }]),
      );
    });
  });
  describe('createSegments', () => {
    // Duration query
    test.todo("Requests the video's duration if it's not found");
    // Timestamp validation
    test.todo('Throws with negative t1');
    test.todo('Throws when t2 < t1');
    test.todo('Throws when t2 = t1');
    test.todo('Throws when t2 > duration');
    // Segment checking
    test.todo('Throws when given too many segments');
    test.todo('Checks against existing segments');
    test.todo('Only counts unique segments for video W.T.');
    // Deletion flag
    test.todo('Throws when video is flagged for deletion');
    // Write stage
    test.todo('Watches deletion flag');
    test.todo('Counts correct watch times');
    test.todo('Writes watch times to correct keys');
    test.todo('Writes correct segments');
    test.todo('Writes segments to correct key');
    // Search service
    test.todo('Updates the search service every ~60 seconds of W.T.');
    // Return
    test.todo('Returns new segments');
  });
  describe('getTotalWatchTime', () => {
    test.todo('Looks up the correct key');
    test.todo('Returns correct W.T.');
  });
  describe('getWatchTime', () => {
    test.todo('Looks up the correct key');
    test.todo('Returns the correct W.T.');
  });
  describe('clearUserOnVideo', () => {
    test.todo('Deletes the correct keys');
  });
  describe('clearVideo', () => {
    test.todo('Checks deletion flag');
    test.todo('Throws if deletion flag is set');
    test.todo('Sets deleted flag');
    test.todo('Deletes every scanned key');
    test.todo('Executes multi');
  });
});
