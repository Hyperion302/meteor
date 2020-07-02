import * as ChannelDataService from './';
import { IChannel, IChannelQuery, IChannelUpdate } from './definitions';
import { IServiceInvocationContext } from '@/definitions';

const sharedInstances = require('@/sharedInstances');
const searchService = require('@services/SearchService');
const uuid = require('uuid/v4');

jest.mock('@/sharedInstances');
jest.mock('@services/SearchService');
jest.mock('uuid/v4');

const testChannel: IChannel = {
  id: '8c352a70-ee3b-4691-83e7-20c48cbc799e',
  name: 'New Good Channel :)',
  owner: 'FDJIVPG1xgXfXmm67ETETSn9MSe2',
};

const mockContext: IServiceInvocationContext = {
  auth: {
    elevated: false,
    userID: 'FDJIVPG1xgXfXmm67ETETSn9MSe2',
    token: null, // None of the services should be using this
  },
};

function mockImplementations() {
  // Mock firestore document
  sharedInstances.mockData.mockImplementation(() => {
    return testChannel;
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

describe('Channel Data Sevice', () => {
  describe('getChannel', () => {
    it('Requests the correct channel ID', async () => {
      await ChannelDataService.getChannel(mockContext, testChannel.id);
      expect(sharedInstances.mockDoc).toHaveBeenCalledWith(
        `${sharedInstances.mockConfig().dbPrefix}channels/${testChannel.id}`,
      );
    });
    it('Checks if the channel exists', async () => {
      await ChannelDataService.getChannel(mockContext, testChannel.id);
      expect(sharedInstances.mockExists).toBeCalled();
    });
    it('Responds with the correct channel', async () => {
      const res = await ChannelDataService.getChannel(
        mockContext,
        testChannel.id,
      );
      expect(res).toMatchInlineSnapshot(`
                Object {
                  "id": "8c352a70-ee3b-4691-83e7-20c48cbc799e",
                  "name": "New Good Channel :)",
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
      const promise = ChannelDataService.queryChannel(mockContext, {});

      expect(promise).rejects.toThrow();
    });
    it('References correct collection', async () => {
      await ChannelDataService.queryChannel(mockContext, sampleQuery);

      expect(sharedInstances.mockCollection).toBeCalledWith(
        `${sharedInstances.mockConfig().dbPrefix}channels`,
      );
    });
    it("Constructs the correct query for 'owner'", async () => {
      await ChannelDataService.queryChannel(mockContext, sampleQuery);

      expect(sharedInstances.mockWhere).toHaveBeenCalledWith(
        'owner',
        '==',
        sampleQuery.owner,
      );
    });
    it('Properly maps query responses', async () => {
      await ChannelDataService.queryChannel(mockContext, sampleQuery);

      expect(sharedInstances.mockMap).toHaveBeenCalled();
    });
    it('Returns the correct data', async () => {
      const res = await ChannelDataService.queryChannel(
        mockContext,
        sampleQuery,
      );

      expect(res).toBeArray(); // Probably should test return value
    });
  });

  describe('createChannel', () => {
    const testName = 'New channel';

    it('Adds the channel to the search index', async () => {
      await ChannelDataService.createChannel(mockContext, testName);

      expect(searchService.addChannel).toHaveBeenCalledWith(mockContext, {
        id: '3d1afd2a-04a2-47f9-9c65-e34b6465b83a',
        owner: mockContext.auth.userID,
        name: testName,
      });
    });
    it('References the correct new document', async () => {
      await ChannelDataService.createChannel(mockContext, testName);

      expect(sharedInstances.mockDoc).toHaveBeenCalledWith(
        `${
          sharedInstances.mockConfig().dbPrefix
        }channels/3d1afd2a-04a2-47f9-9c65-e34b6465b83a`,
      );
    });
    it('Sets the correct data', async () => {
      await ChannelDataService.createChannel(mockContext, testName);

      expect(sharedInstances.mockSet).toHaveBeenCalledWith({
        id: '3d1afd2a-04a2-47f9-9c65-e34b6465b83a',
        owner: mockContext.auth.userID,
        name: testName,
      });
    });
    it('Returns the new channel', async () => {
      const res = await ChannelDataService.createChannel(mockContext, testName);

      expect(res).toMatchInlineSnapshot(`
                Object {
                  "id": "3d1afd2a-04a2-47f9-9c65-e34b6465b83a",
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
        mockContext,
        testChannel.id,
        testNameUpdate,
      );

      expect(sharedInstances.mockExists).toBeCalled();
    });
    it('Updates the channel record', async () => {
      await ChannelDataService.updateChannel(
        mockContext,
        testChannel.id,
        testNameUpdate,
      );

      expect(sharedInstances.mockUpdate).toHaveBeenCalled();
    });
    it('Updates the correct channel record', async () => {
      await ChannelDataService.updateChannel(
        mockContext,
        testChannel.id,
        testNameUpdate,
      );

      expect(sharedInstances.mockDoc).toHaveBeenCalledWith(
        `${sharedInstances.mockConfig().dbPrefix}channels/${testChannel.id}`,
      );
    });
    it('Silently performs no update if given no changes', async () => {
      await ChannelDataService.updateChannel(
        mockContext,
        testChannel.id,
        testEmptyUpdate,
      );

      expect(sharedInstances.mockUpdate).toHaveBeenCalledWith({});
    });
    it('Updates name only if given a name', async () => {
      await ChannelDataService.updateChannel(
        mockContext,
        testChannel.id,
        testNameUpdate,
      );

      expect(sharedInstances.mockUpdate).toHaveBeenCalledWith(testNameUpdate);
    });
    it('Requests new channel record after update', async () => {
      await ChannelDataService.updateChannel(
        mockContext,
        testChannel.id,
        testNameUpdate,
      );

      expect(sharedInstances.mockDoc).toHaveBeenLastCalledWith(
        `${sharedInstances.mockConfig().dbPrefix}channels/${testChannel.id}`,
      );
    });
    it('Updates the search index', async () => {
      await ChannelDataService.updateChannel(
        mockContext,
        testChannel.id,
        testNameUpdate,
      );

      expect(searchService.updateChannel.mock.calls[0][1])
        .toMatchInlineSnapshot(`
                    Object {
                      "id": "8c352a70-ee3b-4691-83e7-20c48cbc799e",
                      "name": "New Good Channel :)",
                      "owner": "FDJIVPG1xgXfXmm67ETETSn9MSe2",
                    }
                `);
    });
    it('Returns the updated channel', async () => {
      const res = await ChannelDataService.updateChannel(
        mockContext,
        testChannel.id,
        testNameUpdate,
      );

      expect(res).toMatchInlineSnapshot(`
                Object {
                  "id": "8c352a70-ee3b-4691-83e7-20c48cbc799e",
                  "name": "New Good Channel :)",
                  "owner": "FDJIVPG1xgXfXmm67ETETSn9MSe2",
                }
            `);
    });
  });

  describe('deleteChannel', () => {
    it('Checks to see if the channel exists first', async () => {
      await ChannelDataService.deleteChannel(mockContext, testChannel.id);

      expect(sharedInstances.mockDoc).toHaveBeenCalledWith(
        `${sharedInstances.mockConfig().dbPrefix}channels/${testChannel.id}`,
      );
      expect(sharedInstances.mockExists).toHaveBeenCalled();
    });
    it('Deletes everything in the right order', async () => {
      await ChannelDataService.deleteChannel(mockContext, testChannel.id);

      expect(searchService.removeChannel).toHaveBeenCalledBefore(
        sharedInstances.mockDelete,
      );
    });
    it('Deletes the correct search index', async () => {
      await ChannelDataService.deleteChannel(mockContext, testChannel.id);

      expect(searchService.removeChannel.mock.calls[0][1])
        .toMatchInlineSnapshot(`
                    Object {
                      "id": "8c352a70-ee3b-4691-83e7-20c48cbc799e",
                      "name": "New Good Channel :)",
                      "owner": "FDJIVPG1xgXfXmm67ETETSn9MSe2",
                    }
                `);
    });
    it('Deletes the channel record', async () => {
      await ChannelDataService.deleteChannel(mockContext, testChannel.id);

      expect(sharedInstances.mockDelete).toHaveBeenCalled();
    });
  });
});
