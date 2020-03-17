import * as ChannelContentService from './';
import {
    DuplexMock,
    ObjectWritableMock,
    ObjectReadableMock,
} from 'stream-mock';
import { SharpInstance } from '../../../__mocks__/sharp';
import { IServiceInvocationContext } from '../../definitions';
import { IChannel } from '../ChannelDataService/definitions';

const sharedInstances = require('../../sharedInstances');
const ChannelDataService = require('../ChannelDataService');
const sharp = require('sharp');

const mockContext: IServiceInvocationContext = {
    auth: {
        userID: 'FDJIVPG1xgXfXmm67ETETSn9MSe2',
        token: null, // None of the services should be using this
    },
};

const testChannel: IChannel = {
    id: '716886dd-c107-4bd7-9060-a47b50f81689',
    name: 'Test Channel',
    owner: 'FDJIVPG1xgXfXmm67ETETSn9MSe2',
};

jest.mock('../../sharedInstances');
jest.mock('../ChannelDataService');

function mockImplementations() {
    // Mock channel
    ChannelDataService.getChannel.mockImplementation(() => testChannel);
}

beforeAll(() => {
    mockImplementations();
});

beforeEach(() => {
    jest.clearAllMocks();
});

describe('Channel Content Service', () => {
    describe('uploadIcon', () => {
        const storageMetadata = {
            metadata: {
                contentType: 'image/png',
            },
        };
        it('Passes (Compressed Test)', async () => {
            const testInput = new ObjectReadableMock(['a', 'b', 'c', 'd', 'e']);
            await ChannelContentService.uploadIcon(
                mockContext,
                testChannel.id,
                testInput,
            );

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
                `channelIcons/${testChannel.id}_128.png`,
            );
            expect(sharedInstances.mockFile).toHaveBeenNthCalledWith(
                2,
                `channelIcons/${testChannel.id}_64.png`,
            );
            expect(sharedInstances.mockFile).toHaveBeenNthCalledWith(
                3,
                `channelIcons/${testChannel.id}_32.png`,
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
