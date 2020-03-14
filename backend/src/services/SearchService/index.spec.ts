import * as SearchService from './';
import { IChannel } from '../ChannelDataService/definitions';
import { IVideo } from '../VideoDataService/definitions';

const sharedInstances = require('../../sharedInstances');

jest.mock('../../sharedInstances');

const testChannel: IChannel = {
    id: '8c352a70-ee3b-4691-83e7-20c48cbc799e',
    name: 'New Good Channel :)',
    owner: 'FDJIVPG1xgXfXmm67ETETSn9MSe2',
};

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
    },
    description: 'Test Video Description',
    title: 'Test Video Name',
    uploadDate: 1578009691,
};

function mockImplementations() {
    // No implementation mocks required
}

beforeAll(() => {
    mockImplementations();
});

beforeEach(() => {
    jest.clearAllMocks();
});

describe('Search Service', () => {
    describe('addVideo', () => {
        it('Saves video object in Algolia', async () => {
            await SearchService.addVideo(testVideo);

            expect(sharedInstances.mockSaveObject.mock.calls[0][0])
                .toMatchInlineSnapshot(`
                Object {
                  "description": "Test Video Description",
                  "objectID": "3d1afd2a-04a2-47f9-9c65-e34b6465b83a",
                  "title": "Test Video Name",
                  "type": "video",
                  "uploadDate": 1578009691,
                }
            `);
        });
    });
    describe('updateVideo', () => {
        it('Saves video object in Algolia', async () => {
            await SearchService.updateVideo(testVideo);

            expect(sharedInstances.mockSaveObject.mock.calls[0][0])
                .toMatchInlineSnapshot(`
                Object {
                  "description": "Test Video Description",
                  "objectID": "3d1afd2a-04a2-47f9-9c65-e34b6465b83a",
                  "title": "Test Video Name",
                  "type": "video",
                  "uploadDate": 1578009691,
                }
            `);
        });
    });
    describe('removeVideo', () => {
        it('Removes video object from Algolia', async () => {
            await SearchService.removeVideo(testVideo.id);

            expect(sharedInstances.mockDeleteObject).toHaveBeenCalledWith(
                testVideo.id,
            );
        });
    });

    describe('addChannel', () => {
        it('Saves channel object in Algolia', async () => {
            await SearchService.addChannel(testChannel);

            expect(sharedInstances.mockSaveObject.mock.calls[0][0])
                .toMatchInlineSnapshot(`
                Object {
                  "name": "New Good Channel :)",
                  "objectID": "8c352a70-ee3b-4691-83e7-20c48cbc799e",
                  "type": "channel",
                }
            `);
        });
    });
    describe('updateChannel', () => {
        it('Saves channel object in Algolia', async () => {
            await SearchService.updateChannel(testChannel);

            expect(sharedInstances.mockSaveObject.mock.calls[0][0])
                .toMatchInlineSnapshot(`
                Object {
                  "name": "New Good Channel :)",
                  "objectID": "8c352a70-ee3b-4691-83e7-20c48cbc799e",
                  "type": "channel",
                }
            `);
        });
    });
    describe('removeChannel', () => {
        it('Removes channel object from Algolia', async () => {
            await SearchService.removeChannel(testChannel.id);

            expect(sharedInstances.mockDeleteObject).toHaveBeenCalledWith(
                testChannel.id,
            );
        });
    });
});
