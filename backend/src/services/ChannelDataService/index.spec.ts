import * as ChannelDataService from './';
import { IChannel, IChannelQuery, IChannelUpdate } from './definitions';
import { IServiceInvocationContext } from '@/definitions';
import { fakeChannel, fakeContext, fakeIDs } from '@/sharedTestData';

const sharedInstances = require('@/sharedInstances');
const searchService = require('@services/SearchService');

jest.mock('@/sharedInstances');
jest.mock('@services/SearchService');

function mockImplementations() {
  // Mock firestore document
  sharedInstances.mockData.mockImplementation(() => {
    return fakeChannel;
  });
  // Mock ID
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

describe('Channel Data Sevice', () => {
  describe('getChannel', () => {
    it('Requests the correct channel ID', async () => {
      await ChannelDataService.getChannel(fakeContext, fakeChannel.id);
      expect(sharedInstances.mockDoc).toHaveBeenCalledWith(
        `${sharedInstances.mockConfig().dbPrefix}channels/${fakeChannel.id}`,
      );
    });
    it('Checks if the channel exists', async () => {
      await ChannelDataService.getChannel(fakeContext, fakeChannel.id);
      expect(sharedInstances.mockExists).toBeCalled();
    });
    it('Responds with the correct channel', async () => {
      const res = await ChannelDataService.getChannel(
        fakeContext,
        fakeChannel.id,
      );
      expect(res).toMatchInlineSnapshot(`
        Object {
          "id": "73877867791908867",
          "name": "Test Channel",
          "owner": "FDJIVPG1xgXfXmm67ETETSn9MSe2",
        }
      `);
    });
  });

  describe('queryChannel', () => {
    const sampleQuery: IChannelQuery = {
      owner: 'FDJIVPG1xgXfXmm67ETETSn9MSe2',
    };
    it('Fails with empty query', async () => {
      const promise = ChannelDataService.queryChannel(fakeContext, {});

      expect(promise).rejects.toThrow();
    });
    it('References correct collection', async () => {
      await ChannelDataService.queryChannel(fakeContext, sampleQuery);

      expect(sharedInstances.mockCollection).toBeCalledWith(
        `${sharedInstances.mockConfig().dbPrefix}channels`,
      );
    });
    it("Constructs the correct query for 'owner'", async () => {
      await ChannelDataService.queryChannel(fakeContext, sampleQuery);

      expect(sharedInstances.mockWhere).toHaveBeenCalledWith(
        'owner',
        '==',
        sampleQuery.owner,
      );
    });
    it('Properly maps query responses', async () => {
      await ChannelDataService.queryChannel(fakeContext, sampleQuery);

      expect(sharedInstances.mockMap).toHaveBeenCalled();
    });
    it('Returns the correct data', async () => {
      const res = await ChannelDataService.queryChannel(
        fakeContext,
        sampleQuery,
      );

      expect(res).toBeArray(); // Probably should test return value
    });
  });

  describe('createChannel', () => {
    const testName = 'New channel';

    it('Adds the channel to the search index', async () => {
      await ChannelDataService.createChannel(fakeContext, testName);

      expect(searchService.addChannel).toHaveBeenCalledWith(fakeContext, {
        id: fakeIDs[0],
        owner: fakeContext.auth.userID,
        name: testName,
      });
    });
    it('References the correct new document', async () => {
      await ChannelDataService.createChannel(fakeContext, testName);

      expect(sharedInstances.mockDoc).toHaveBeenCalledWith(
        `${sharedInstances.mockConfig().dbPrefix}channels/${fakeIDs[0]}`,
      );
    });
    it('Sets the correct data', async () => {
      await ChannelDataService.createChannel(fakeContext, testName);

      expect(sharedInstances.mockSet).toHaveBeenCalledWith({
        id: fakeIDs[0],
        owner: fakeContext.auth.userID,
        name: testName,
      });
    });
    it('Returns the new channel', async () => {
      const res = await ChannelDataService.createChannel(fakeContext, testName);

      expect(res).toMatchInlineSnapshot(`
        Object {
          "id": "73878773241479168",
          "name": "New channel",
          "owner": "FDJIVPG1xgXfXmm67ETETSn9MSe2",
        }
      `);
    });
  });

  describe('updateChannel', () => {
    const testEmptyUpdate: IChannelUpdate = {};
    const testNameUpdate: IChannelUpdate = {
      name: 'New cool channel name',
    };

    it('Checks that the channel exists first', async () => {
      await ChannelDataService.updateChannel(
        fakeContext,
        fakeChannel.id,
        testNameUpdate,
      );

      expect(sharedInstances.mockExists).toBeCalled();
    });
    it('Updates the channel record', async () => {
      await ChannelDataService.updateChannel(
        fakeContext,
        fakeChannel.id,
        testNameUpdate,
      );

      expect(sharedInstances.mockUpdate).toHaveBeenCalled();
    });
    it('Updates the correct channel record', async () => {
      await ChannelDataService.updateChannel(
        fakeContext,
        fakeChannel.id,
        testNameUpdate,
      );

      expect(sharedInstances.mockDoc).toHaveBeenCalledWith(
        `${sharedInstances.mockConfig().dbPrefix}channels/${fakeChannel.id}`,
      );
    });
    it('Silently performs no update if given no changes', async () => {
      await ChannelDataService.updateChannel(
        fakeContext,
        fakeChannel.id,
        testEmptyUpdate,
      );

      expect(sharedInstances.mockUpdate).toHaveBeenCalledWith({});
    });
    it('Updates name only if given a name', async () => {
      await ChannelDataService.updateChannel(
        fakeContext,
        fakeChannel.id,
        testNameUpdate,
      );

      expect(sharedInstances.mockUpdate).toHaveBeenCalledWith(testNameUpdate);
    });
    it('Requests new channel record after update', async () => {
      await ChannelDataService.updateChannel(
        fakeContext,
        fakeChannel.id,
        testNameUpdate,
      );

      expect(sharedInstances.mockDoc).toHaveBeenLastCalledWith(
        `${sharedInstances.mockConfig().dbPrefix}channels/${fakeChannel.id}`,
      );
    });
    it('Updates the search index', async () => {
      await ChannelDataService.updateChannel(
        fakeContext,
        fakeChannel.id,
        testNameUpdate,
      );

      expect(searchService.updateChannel.mock.calls[0][1])
        .toMatchInlineSnapshot(`
        Object {
          "id": "73877867791908867",
          "name": "Test Channel",
          "owner": "FDJIVPG1xgXfXmm67ETETSn9MSe2",
        }
      `);
    });
    it('Returns the updated channel', async () => {
      const res = await ChannelDataService.updateChannel(
        fakeContext,
        fakeChannel.id,
        testNameUpdate,
      );

      expect(res).toMatchInlineSnapshot(`
        Object {
          "id": "73877867791908867",
          "name": "Test Channel",
          "owner": "FDJIVPG1xgXfXmm67ETETSn9MSe2",
        }
      `);
    });
  });

  describe('deleteChannel', () => {
    it('Checks to see if the channel exists first', async () => {
      await ChannelDataService.deleteChannel(fakeContext, fakeChannel.id);

      expect(sharedInstances.mockDoc).toHaveBeenCalledWith(
        `${sharedInstances.mockConfig().dbPrefix}channels/${fakeChannel.id}`,
      );
      expect(sharedInstances.mockExists).toHaveBeenCalled();
    });
    it('Deletes everything in the right order', async () => {
      await ChannelDataService.deleteChannel(fakeContext, fakeChannel.id);

      expect(searchService.removeChannel).toHaveBeenCalledBefore(
        sharedInstances.mockDelete,
      );
    });
    it('Deletes the correct search index', async () => {
      await ChannelDataService.deleteChannel(fakeContext, fakeChannel.id);

      expect(searchService.removeChannel.mock.calls[0][1])
        .toMatchInlineSnapshot(`
Object {
  "id": "73877867791908867",
  "name": "Test Channel",
  "owner": "FDJIVPG1xgXfXmm67ETETSn9MSe2",
}
`);
    });
    it('Deletes the channel record', async () => {
      await ChannelDataService.deleteChannel(fakeContext, fakeChannel.id);

      expect(sharedInstances.mockDelete).toHaveBeenCalled();
    });
  });
});
