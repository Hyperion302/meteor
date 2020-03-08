import * as videoContentService from './';
import { IVideoContent } from './definitions';
import { ObjectReadableMock, ObjectWritableMock } from 'stream-mock';
import moxios from 'moxios';

const sharedInstances = require('../../sharedInstances');

jest.mock('../../sharedInstances');

const testContent: IVideoContent = {
    id: 'b5263a52-1c05-4ab7-813d-65b8866bacfd',
    assetID: 'SNW1q1R01PdIkf26Kn01DIKAgYtq2qgWRo',
    playbackID: '1ZjsLIn0167NzZ02TGbbGEngvGbMCAA00sG',
};

function mockImplementations() {
    // Mock firestore document
    sharedInstances.mockData.mockImplementation(() => {
        return testContent;
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
            await videoContentService.getVideo(testContent.id);

            expect(sharedInstances.mockDoc).toHaveBeenCalledWith(
                `content/${testContent.id}`,
            );
        });
        it('Checks to see if the content record exists', async () => {
            await videoContentService.getVideo(testContent.id);

            expect(sharedInstances.mockExists).toHaveBeenCalled();
        });
        it('Responds with the correct content data', async () => {
            const res = await videoContentService.getVideo(testContent.id);

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
        const testUploader = 'FDJIVPG1xgXfXmm67ETETSn9MSe2';
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
                testID,
                testUploader,
                testInput,
                testMime,
            );

            expect(sharedInstances.mockBucket).toBeCalledWith('meteor-videos');
        });
        it('References the correct file path', async () => {
            const testInput = new ObjectReadableMock([0, 1, 2, 3, 4]);
            await videoContentService.uploadVideo(
                testID,
                testUploader,
                testInput,
                testMime,
            );

            expect(sharedInstances.mockFile).toBeCalledWith(
                `masters/${testUploader}/${testID}`,
            );
        });
        it('Creates a writestream with the correct parameters', async () => {
            const testInput = new ObjectReadableMock([0, 1, 2, 3, 4]);
            await videoContentService.uploadVideo(
                testID,
                testUploader,
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
                testID,
                testUploader,
                testInput,
                testMime,
            );

            expect(sharedInstances.mockMakePublic).toHaveBeenCalled();
        });
        it('Sends transcoding request to Mux', (done) => {
            const testInput = new ObjectReadableMock([0, 1, 2, 3, 4]);
            videoContentService
                .uploadVideo(testID, testUploader, testInput, testMime)
                .then(() => {
                    moxios.wait(() => {
                        let request = moxios.requests.mostRecent();
                        expect(
                            request.config.auth.password,
                        ).not.toBeUndefined();
                        expect(
                            request.config.auth.username,
                        ).not.toBeUndefined();
                        expect(request.config.method).toEqual('post');
                        expect(request.config.data).toMatchInlineSnapshot(
                            `"{\\"input\\":\\"https://storage.googleapis.com/meteor-videos/masters/FDJIVPG1xgXfXmm67ETETSn9MSe2/3d1afd2a-04a2-47f9-9c65-e34b6465b83a\\",\\"playback_policy\\":[\\"public\\"],\\"passthrough\\":\\"3d1afd2a-04a2-47f9-9c65-e34b6465b83a\\"}"`,
                        );
                        done();
                    });
                });
        });
    });
});
