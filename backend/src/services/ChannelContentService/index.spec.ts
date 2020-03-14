import * as ChannelContentService from './';
import {
    DuplexMock,
    ObjectWritableMock,
    ObjectReadableMock,
} from 'stream-mock';
import { SharpInstance } from '../../../__mocks__/sharp';

const sharedInstances = require('../../sharedInstances');
const sharp = require('sharp');

jest.mock('../../sharedInstances');

function mockImplementations() {
    // No mocking required
}

beforeAll(() => {
    mockImplementations();
});

beforeEach(() => {
    jest.clearAllMocks();
});

describe('Channel Content Service', () => {
    describe('uploadIcon', () => {
        const testID = '3d1afd2a-04a2-47f9-9c65-e34b6465b83a';
        const storageMetadata = {
            metadata: {
                contentType: 'image/png',
            },
        };
        it('Passes (Compressed Test)', async () => {
            const testInput = new ObjectReadableMock(['a', 'b', 'c', 'd', 'e']);
            await ChannelContentService.uploadIcon(testID, testInput);

            // References correct bucket

            expect(sharedInstances.mockBucket).toHaveBeenNthCalledWith(
                1,
                'meteor-videos',
            );
            expect(sharedInstances.mockBucket).toHaveBeenNthCalledWith(
                2,
                'meteor-videos',
            );

            expect(sharedInstances.mockBucket).toHaveBeenNthCalledWith(
                3,
                'meteor-videos',
            );

            // References correct paths

            expect(sharedInstances.mockFile).toHaveBeenNthCalledWith(
                1,
                `channelIcons/${testID}_128.png`,
            );
            expect(sharedInstances.mockFile).toHaveBeenNthCalledWith(
                2,
                `channelIcons/${testID}_64.png`,
            );
            expect(sharedInstances.mockFile).toHaveBeenNthCalledWith(
                3,
                `channelIcons/${testID}_32.png`,
            );

            // Creates proper write streams

            expect(
                sharedInstances.mockCreateWriteStream,
            ).toHaveBeenNthCalledWith(1, storageMetadata);
            expect(
                sharedInstances.mockCreateWriteStream,
            ).toHaveBeenNthCalledWith(2, storageMetadata);
            expect(
                sharedInstances.mockCreateWriteStream,
            ).toHaveBeenNthCalledWith(3, storageMetadata);

            // Makes uploaded files public

            expect(sharedInstances.mockMakePublic).toHaveBeenCalledTimes(3);
        });
    });
});
