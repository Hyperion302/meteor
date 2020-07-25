import * as ChannelDataService from './';
import {
  IChannel,
  IChannelQuery,
  IChannelUpdate,
  IChannelSchema,
} from './definitions';
import { IServiceInvocationContext } from '@/definitions';
import {
  fakeChannel,
  fakeContext,
  fakeIDs,
  fakeChannelSchema,
} from '@/sharedTestData';
import {
  InvalidQueryError,
  ResourceNotFoundError,
  AuthorizationError,
} from '@/errors';

const sharedInstances = require('@/sharedInstances');
jest.mock('@/sharedInstances');

const searchService = require('@services/SearchService');
jest.mock('@services/SearchService');

const db = require('./db');
jest.mock('./db');

function mockImplementations() {
  // Mock DB read
  db.mockResponse.mockReturnValue([fakeChannelSchema]);
  // Mock ID
  sharedInstances.mockID.mockReturnValue(fakeIDs[0]);
}

beforeAll(() => {
  mockImplementations();
});

beforeEach(() => {
  jest.clearAllMocks();
});

describe('Channel Data Sevice', () => {
  describe('getChannel', () => {
    it('Executes the correct query', async () => {
      await ChannelDataService.getChannel(fakeContext, fakeChannel.id);
      expect(db.mockSelect).toHaveBeenCalledWith('*'); // All columns
      expect(db.mockFrom).toHaveBeenCalledWith('channel'); // Correct table
      expect(db.mockWhere).toHaveBeenCalledWith('id', fakeIDs[1]); // Correct ID
    });
    it('Responds with the correct channel', async () => {
      const res = await ChannelDataService.getChannel(
        fakeContext,
        fakeChannel.id,
      );
      expect(res).toEqual(fakeChannel);
    });
  });

  describe('queryChannel', () => {
    const sampleQuery: IChannelQuery = {
      owner: fakeChannel.owner,
    };
    it('Fails with empty query', async () => {
      const promise = ChannelDataService.queryChannel(fakeContext, {});
      await expect(promise).rejects.toMatchObject(
        new InvalidQueryError('ChannelData', {}),
      );
    });
    it('Executes the correct query', async () => {
      await ChannelDataService.queryChannel(fakeContext, sampleQuery);
      expect(db.mockSelect).toHaveBeenCalledWith('*'); // All columns
      expect(db.mockFrom).toHaveBeenCalledWith('channel'); // Correct table
      expect(db.mockWhere).toHaveBeenCalledWith('owner_id', sampleQuery.owner);
    });
    it('Returns the correct data', async () => {
      const res = await ChannelDataService.queryChannel(
        fakeContext,
        sampleQuery,
      );

      expect(res).toBeArray();
      expect(res).toContainEqual(fakeChannel);
    });
  });

  describe('createChannel', () => {
    const testName = 'New channel';
    const expectedNewChannel: IChannel = {
      id: fakeIDs[0],
      name: testName,
      owner: fakeContext.auth.userID,
    };
    const expectedNewSchema: IChannelSchema = {
      id: expectedNewChannel.id,
      name: expectedNewChannel.name,
      owner_id: expectedNewChannel.owner,
    };

    it('Fails if the user already has 10 channels', async () => {
      db.mockResponse.mockReturnValueOnce(Array(10).fill(fakeChannel));
      const promise = ChannelDataService.createChannel(fakeContext, testName);
      return expect(promise).rejects.toEqual(
        new AuthorizationError(
          'ChannelData',
          `create more than ${ChannelDataService.MAX_CHANNELS} channels`,
        ),
      );
    });
    it('Adds the channel to the search index', async () => {
      await ChannelDataService.createChannel(fakeContext, testName);

      expect(searchService.addChannel).toHaveBeenCalledWith(
        fakeContext,
        expectedNewChannel,
      );
    });
    it('Executes the correct insert query', async () => {
      await ChannelDataService.createChannel(fakeContext, testName);

      expect(db.mockInsert).toHaveBeenCalledWith(expectedNewSchema);
    });
    it('Returns the new channel', async () => {
      const res = await ChannelDataService.createChannel(fakeContext, testName);

      expect(res).toEqual(expectedNewChannel);
    });
  });

  describe('updateChannel', () => {
    const testEmptyUpdate: IChannelUpdate = {};
    const testNameUpdate: IChannelUpdate = {
      name: 'New cool channel name',
    };
    const expectedNewChannel: IChannel = {
      ...fakeChannel,
      name: testNameUpdate.name,
    };
    const expectedNewChannelSchema: IChannelSchema = {
      ...fakeChannelSchema,
      name: testNameUpdate.name,
    };

    it('Fails if the channel does not exist', () => {
      db.mockResponse.mockImplementationOnce((): any[] => []);
      const promise = ChannelDataService.updateChannel(
        fakeContext,
        fakeChannel.id,
        testNameUpdate,
      );
      return expect(promise).rejects.toMatchObject(
        new ResourceNotFoundError('ChannelData', 'channel', fakeChannel.id),
      );
    });
    it('Executes the correct update query', async () => {
      await ChannelDataService.updateChannel(
        fakeContext,
        fakeChannel.id,
        testNameUpdate,
      );
      expect(db.mockUpdate).toHaveBeenCalledWith(testNameUpdate);
      expect(db.mockWhere.mock.calls[1]).toEqual(['id', fakeChannel.id]);
    });
    it('Silently performs no update if given no changes', async () => {
      await ChannelDataService.updateChannel(
        fakeContext,
        fakeChannel.id,
        testEmptyUpdate,
      );
      expect(db.mockUpdate).not.toHaveBeenCalled();
    });
    it('Updates the search index with the new channel', async () => {
      db.mockResponse.mockReturnValueOnce([fakeChannelSchema]);
      db.mockResponse.mockReturnValueOnce([]);
      db.mockResponse.mockReturnValueOnce([expectedNewChannelSchema]);
      await ChannelDataService.updateChannel(
        fakeContext,
        fakeChannel.id,
        testNameUpdate,
      );

      expect(searchService.updateChannel.mock.calls[0][1]).toEqual(
        expectedNewChannel,
      );
    });
    it('Returns the updated channel', async () => {
      db.mockResponse.mockReturnValueOnce([fakeChannelSchema]);
      db.mockResponse.mockReturnValueOnce([]);
      db.mockResponse.mockReturnValueOnce([expectedNewChannelSchema]);
      const res = await ChannelDataService.updateChannel(
        fakeContext,
        fakeChannel.id,
        testNameUpdate,
      );

      expect(res).toEqual(expectedNewChannel);
    });
  });

  describe('deleteChannel', () => {
    it('Fails if the channel does not exist', () => {
      db.mockResponse.mockReturnValueOnce([]);
      const promise = ChannelDataService.deleteChannel(
        fakeContext,
        fakeChannel.id,
      );
      return expect(promise).rejects.toEqual(
        new ResourceNotFoundError('ChannelData', 'channel', fakeChannel.id),
      );
    });
    it('Deletes the correct entry in the search index', async () => {
      await ChannelDataService.deleteChannel(fakeContext, fakeChannel.id);

      expect(searchService.removeChannel.mock.calls[0][1]).toEqual(fakeChannel);
    });
    it('Deletes the channel record', async () => {
      await ChannelDataService.deleteChannel(fakeContext, fakeChannel.id);
      expect(db.mockTable).toHaveBeenLastCalledWith('channel'); // Correct table
      expect(db.mockWhere).toHaveBeenLastCalledWith('id', fakeChannel.id); // Correct channel
      expect(db.mockDel).toHaveBeenCalled();
    });
  });
});
