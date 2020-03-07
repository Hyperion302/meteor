import * as ChannelDataService from './';
import { IChannel } from './definitions';

const sharedInstances = require('../../sharedInstances');

jest.mock('../../sharedInstances');

const testChannel: IChannel = {
    id: '8c352a70-ee3b-4691-83e7-20c48cbc799e',
    name: 'New Good Channel :)',
    owner: 'FDJIVPG1xgXfXmm67ETETSn9MSe2',
};

function mockImplementations() {
    // Mock firestore document
    sharedInstances.mockData.mockImplementation(() => {
        return testChannel;
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
            await ChannelDataService.getChannel(testChannel.id);
            expect(sharedInstances.mockDoc).toHaveBeenCalledWith(
                `channels/${testChannel.id}`,
            );
        });
        it('Checks if the channel exists', async () => {
            await ChannelDataService.getChannel(testChannel.id);
            expect(sharedInstances.mockExists).toBeCalled();
        });
        it('Responds with the correct channel', async () => {
            const res = await ChannelDataService.getChannel(testChannel.id);
            expect(res).toMatchInlineSnapshot(`
                Object {
                  "id": "8c352a70-ee3b-4691-83e7-20c48cbc799e",
                  "name": "New Good Channel :)",
                  "owner": "FDJIVPG1xgXfXmm67ETETSn9MSe2",
                }
            `);
        });
    });
});
