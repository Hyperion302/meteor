import * as videoContentService from './';
import { IVideoContent } from './definitions';
import { ObjectReadableMock, ObjectWritableMock } from 'stream-mock';
import { IServiceInvocationContext } from '../../definitions';
import moxios from 'moxios';
import { IVideo } from '../VideoDataService/definitions';

const sharedInstances = require('../../sharedInstances');
const VideoDataService = require('../VideoDataService');

jest.mock('../../sharedInstances');
jest.mock('../VideoDataService');

const mockContext: IServiceInvocationContext = {
    auth: {
        userID: 'FDJIVPG1xgXfXmm67ETETSn9MSe2',
        token: null, // None of the services should be using this
    },
};

const testContent: IVideoContent = {
    id: 'b5263a52-1c05-4ab7-813d-65b8866bacfd',
    assetID: 'SNW1q1R01PdIkf26Kn01DIKAgYtq2qgWRo',
    playbackID: '1ZjsLIn0167NzZ02TGbbGEngvGbMCAA00sG',
};

const testVideo: IVideo = {
    id: '3d1afd2a-04a2-47f9-9c65-e34b6465b83a',
    author: 'FDJIVPG1xgXfXmm67ETETSn9MSe2',
    channel: {
        id: '716886dd-c107-4bd7-9060-a47b50f81689',
        name: 'Test Channel',
        owner: 'FDJIVPG1xgXfXmm67ETETSn9MSe2',
    },
    content: testContent,
    description: 'Test Video Description',
    title: 'Test Video Name',
    uploadDate: 1578009691,
};

function mockImplementations() {
    // Mock firestore document
    sharedInstances.mockData.mockImplementation(() => testContent);

    // Mock video
    VideoDataService.getVideo.mockImplementation(() => testVideo);
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
            await videoContentService.getVideo(mockContext, testContent.id);

            expect(sharedInstances.mockDoc).toHaveBeenCalledWith(
                `content/${testContent.id}`,
            );
        });
        it('Checks to see if the content record exists', async () => {
            await videoContentService.getVideo(mockContext, testContent.id);

            expect(sharedInstances.mockExists).toHaveBeenCalled();
        });
        it('Responds with the correct content data', async () => {
            const res = await videoContentService.getVideo(
                mockContext,
                testContent.id,
            );

            expect(res).toMatchInlineSnapshot(`
                Object {
                  "assetID": "SNW1q1R01PdIkf26Kn01DIKAgYtq2qgWRo",
                  "id": "b5263a52-1c05-4ab7-813d-65b8866bacfd",
                  "playbackID": "1ZjsLIn0167NzZ02TGbbGEngvGbMCAA00sG",
                }
            `);
        });
    });
    describe('uploadVideo', () => {
        const testID = '3d1afd2a-04a2-47f9-9c65-e34b6465b83a';
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
                mockContext,
                testID,
                testInput,
                testMime,
            );

            expect(sharedInstances.mockBucket).toBeCalledWith('meteor-videos');
        });
        it('References the correct file path', async () => {
            const testInput = new ObjectReadableMock([0, 1, 2, 3, 4]);
            await videoContentService.uploadVideo(
                mockContext,
                testID,
                testInput,
                testMime,
            );

            expect(sharedInstances.mockFile).toBeCalledWith(
                `masters/${mockContext.auth.userID}/${testID}`,
            );
        });
        it('Creates a writestream with the correct parameters', async () => {
            const testInput = new ObjectReadableMock([0, 1, 2, 3, 4]);
            await videoContentService.uploadVideo(
                mockContext,
                testID,
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
                mockContext,
                testID,
                testInput,
                testMime,
            );

            expect(sharedInstances.mockMakePublic).toHaveBeenCalled();
        });
        it('Sends transcoding request to Mux', (done) => {
            const testInput = new ObjectReadableMock([0, 1, 2, 3, 4]);
            videoContentService
                .uploadVideo(mockContext, testID, testInput, testMime)
                .then(() => {
                    moxios.wait(() => {
                        let request = moxios.requests.mostRecent();
                        expect(request.config.method).toEqual('post');
                        expect(request.config.data).toMatchInlineSnapshot(
                            `"{\\"input\\":\\"https://storage.googleapis.com/meteor-videos/masters/FDJIVPG1xgXfXmm67ETETSn9MSe2/3d1afd2a-04a2-47f9-9c65-e34b6465b83a\\",\\"playback_policy\\":[\\"public\\"],\\"passthrough\\":\\"3d1afd2a-04a2-47f9-9c65-e34b6465b83a\\"}"`,
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
            moxios.stubRequest(
                /https\:\/\/api\.mux\.com\/video\/v1\/assets\/.*/,
                {
                    status: 204,
                },
            );
        });

        afterEach(() => {
            // Teardown Moxios
            moxios.uninstall();
        });
        it('Checks if the content record exists', async () => {
            await videoContentService.deleteVideo(mockContext, testContent.id);

            expect(sharedInstances.mockDoc).toHaveBeenCalledWith(
                `content/${testContent.id}`,
            );
            expect(sharedInstances.mockExists).toHaveBeenCalled();
        });
        it('Deletes the Mux asset', (done) => {
            videoContentService
                .deleteVideo(mockContext, testContent.id)
                .then(() => {
                    moxios.wait(() => {
                        let request = moxios.requests.mostRecent();
                        expect(request.url).toEqual(
                            `https://api.mux.com/video/v1/assets/${testContent.assetID}`,
                        );
                        expect(request.config.auth.password).not.toBeUndefined;
                        expect(request.config.auth.username).not.toBeUndefined;
                        done();
                    });
                });
        });
        it('Deletes the content record', async () => {
            await videoContentService.deleteVideo(mockContext, testContent.id);

            expect(sharedInstances.mockDelete).toHaveBeenCalled();
        });
    });
});
