import * as videoDataService from './';
import 'jest-extended';
import { IVideoUpdate, IVideo, IVideoSchema } from './definitions';
import { IChannel } from '../ChannelDataService/definitions';
import { IVideoContent } from '../VideoContentService/definitions';
const sharedInstances = require('../../sharedInstances');
const channelDataService = require('../ChannelDataService');
const videoContentService = require('../VideoContentService');
const searchService = require('../SearchService');
jest.mock('../../sharedInstances');
jest.mock('../ChannelDataService');
jest.mock('../VideoContentService');
jest.mock('../SearchService');

const testVideo: IVideoSchema = {
    id: '3d1afd2a-04a2-47f9-9c65-e34b6465b83a',
    author: 'FDJIVPG1xgXfXmm67ETETSn9MSe2',
    channel: '716886dd-c107-4bd7-9060-a47b50f81689',
    content: 'b5263a52-1c05-4ab7-813d-65b8866bacfd',
    description: 'Test Video Description',
    title: 'Test Video Name',
    uploadDate: 1578009691,
};

const testChannel: IChannel = {
    id: '716886dd-c107-4bd7-9060-a47b50f81689',
    name: 'Test Channel',
    owner: 'FDJIVPG1xgXfXmm67ETETSn9MSe2',
};

const testContent: IVideoContent = {
    id: 'b5263a52-1c05-4ab7-813d-65b8866bacfd',
    assetID: 'SNW1q1R01PdIkf26Kn01DIKAgYtq2qgWRo',
    playbackID: '1ZjsLIn0167NzZ02TGbbGEngvGbMCAA00sG',
};

function mockImplementations() {
    // Mock firestore document
    sharedInstances.mockData.mockImplementation(() => {
        return testVideo;
    });
    // Mock Channel
    channelDataService.getChannel.mockImplementation((id: string) => {
        return new Promise((resolve) => {
            process.nextTick(() => {
                resolve(testChannel);
            });
        });
    });
    // Mock Content
    videoContentService.getVideo.mockImplementation((id: string) => {
        return new Promise((resolve) => {
            process.nextTick(() => {
                resolve(testContent);
            });
        });
    });
}

beforeAll(() => {
    mockImplementations();
});

beforeEach(() => {
    jest.clearAllMocks();
});

describe('Video Data Service', () => {
    describe('getVideo', () => {
        it('Requests the correct video ID', async () => {
            await videoDataService.getVideo(
                '3d1afd2a-04a2-47f9-9c65-e34b6465b83a',
            );
            expect(sharedInstances.mockDoc).toBeCalledWith(
                'videos/3d1afd2a-04a2-47f9-9c65-e34b6465b83a',
            );
        });
        it('Checks if the video exists', async () => {
            await videoDataService.getVideo(
                '3d1afd2a-04a2-47f9-9c65-e34b6465b83a',
            );
            expect(sharedInstances.mockExists).toBeCalled();
        });
        it('Requests the correct channel ID', async () => {
            await videoDataService.getVideo(
                '3d1afd2a-04a2-47f9-9c65-e34b6465b83a',
            );
            expect(channelDataService.getChannel).toBeCalledWith(
                '716886dd-c107-4bd7-9060-a47b50f81689',
            );
        });
        it('Requests the correct content ID', async () => {
            await videoDataService.getVideo(
                '3d1afd2a-04a2-47f9-9c65-e34b6465b83a',
            );
            expect(videoContentService.getVideo).toBeCalledWith(
                'b5263a52-1c05-4ab7-813d-65b8866bacfd',
            );
        });
        it('Responds with the correct video', async () => {
            const res = await videoDataService.getVideo(
                '3d1afd2a-04a2-47f9-9c65-e34b6465b83a',
            );
            expect(res).toMatchInlineSnapshot(`
                Object {
                  "author": "FDJIVPG1xgXfXmm67ETETSn9MSe2",
                  "channel": Object {
                    "id": "716886dd-c107-4bd7-9060-a47b50f81689",
                    "name": "Test Channel",
                    "owner": "FDJIVPG1xgXfXmm67ETETSn9MSe2",
                  },
                  "content": Object {
                    "assetID": "SNW1q1R01PdIkf26Kn01DIKAgYtq2qgWRo",
                    "id": "b5263a52-1c05-4ab7-813d-65b8866bacfd",
                    "playbackID": "1ZjsLIn0167NzZ02TGbbGEngvGbMCAA00sG",
                  },
                  "description": "Test Video Description",
                  "id": "3d1afd2a-04a2-47f9-9c65-e34b6465b83a",
                  "title": "Test Video Name",
                  "uploadDate": 1578009691,
                }
            `);
        });
    });

    describe('createVideo', () => {});

    describe('queryVideos', () => {});

    describe('updateVideo', () => {
        const testFullUpdate: IVideoUpdate = {
            title: 'New title',
            description: 'New description',
        };
        const testTitleUpdate: IVideoUpdate = {
            title: 'New title',
        };
        const testDescriptionUpdate: IVideoUpdate = {
            description: 'New description',
        };
        const updatedVideoSchema: IVideoSchema = {
            author: testVideo.author,
            channel: testVideo.channel,
            content: testVideo.content,
            description: testFullUpdate.description,
            id: testVideo.id,
            title: testFullUpdate.title,
            uploadDate: testVideo.uploadDate,
        };
        const expectedUpdatedVideo: IVideo = {
            author: testVideo.author,
            channel: testChannel,
            content: testContent,
            description: testFullUpdate.description,
            id: testVideo.id,
            title: testFullUpdate.title,
            uploadDate: testVideo.uploadDate,
        };
        const testBlankUpdate: IVideoUpdate = {};
        it('Checks to see if the video exists first', async () => {
            await videoDataService.updateVideo(
                '3d1afd2a-04a2-47f9-9c65-e34b6465b83a',
                testFullUpdate,
            );
            expect(sharedInstances.mockExists).toBeCalled();
        });
        it('Updates the video record', async () => {
            await videoDataService.updateVideo(
                '3d1afd2a-04a2-47f9-9c65-e34b6465b83a',
                testFullUpdate,
            );
            expect(sharedInstances.mockUpdate).toBeCalled();
        });
        it('Updates the correct video record', async () => {
            await videoDataService.updateVideo(
                '3d1afd2a-04a2-47f9-9c65-e34b6465b83a',
                testFullUpdate,
            );
            expect(sharedInstances.mockUpdate).toBeCalledWith(testFullUpdate);
        });
        it('Only updates title if given only a title', async () => {
            await videoDataService.updateVideo(
                '3d1afd2a-04a2-47f9-9c65-e34b6465b83a',
                testTitleUpdate,
            );
            expect(sharedInstances.mockUpdate).toBeCalledWith(testTitleUpdate);
        });
        it('Only updates description if given only a description', async () => {
            await videoDataService.updateVideo(
                '3d1afd2a-04a2-47f9-9c65-e34b6465b83a',
                testDescriptionUpdate,
            );
            expect(sharedInstances.mockUpdate).toBeCalledWith(
                testDescriptionUpdate,
            );
        });
        it('Silently performs no update if given no changes', async () => {
            await videoDataService.updateVideo(
                '3d1afd2a-04a2-47f9-9c65-e34b6465b83a',
                testBlankUpdate,
            );
            expect(sharedInstances.mockUpdate).toBeCalledWith(testBlankUpdate);
        });
        it('Requests a new video record after updating', async () => {
            await videoDataService.updateVideo(
                '3d1afd2a-04a2-47f9-9c65-e34b6465b83a',
                testFullUpdate,
            );
            expect(sharedInstances.mockDoc).toBeCalled();
        });
        it('Requests the correct new video record', async () => {
            await videoDataService.updateVideo(
                '3d1afd2a-04a2-47f9-9c65-e34b6465b83a',
                testFullUpdate,
            );
            expect(sharedInstances.mockDoc).toHaveBeenLastCalledWith(
                'videos/3d1afd2a-04a2-47f9-9c65-e34b6465b83a',
            );
        });
        it('Updates the search index', async () => {
            await videoDataService.updateVideo(
                '3d1afd2a-04a2-47f9-9c65-e34b6465b83a',
                testFullUpdate,
            );
            expect(searchService.updateVideo).toBeCalled();
        });
        it('Updates the correct video in the search index', async () => {
            // Mock re-request
            sharedInstances.mockData.mockImplementationOnce(() => {
                return updatedVideoSchema; // Updated test video schema.  Updated with test update data
            });
            await videoDataService.updateVideo(
                '3d1afd2a-04a2-47f9-9c65-e34b6465b83a',
                testFullUpdate,
            );
            expect(searchService.updateVideo).toBeCalledWith(
                expectedUpdatedVideo,
            );
        });
        it('Returns the updated video', async () => {
            // Mock re-request
            sharedInstances.mockData.mockImplementationOnce(() => {
                return updatedVideoSchema; // Updated test video schema.  Updated with test update data
            });
            const res = await videoDataService.updateVideo(
                '3d1afd2a-04a2-47f9-9c65-e34b6465b83a',
                testFullUpdate,
            );
            expect(res).toMatchObject(expectedUpdatedVideo);
        });
    });

    describe('deleteVideo', () => {
        it('Checks to see if the video exists first', async () => {
            await videoDataService.deleteVideo(
                '3d1afd2a-04a2-47f9-9c65-e34b6465b83a',
            );

            expect(sharedInstances.mockDoc).toBeCalledWith(
                'videos/3d1afd2a-04a2-47f9-9c65-e34b6465b83a',
            );

            expect(sharedInstances.mockExists).toBeCalled();
        });

        it('Deletes everything in the right order', async () => {
            await videoDataService.deleteVideo(
                '3d1afd2a-04a2-47f9-9c65-e34b6465b83a',
            );

            expect(searchService.removeVideo).toHaveBeenCalledBefore(
                videoContentService.deleteVideo,
            ); // Search before content
            expect(videoContentService.deleteVideo).toHaveBeenCalledBefore(
                sharedInstances.mockDelete,
            ); // Content before delete
        });

        it('Deletes the search index', async () => {
            await videoDataService.deleteVideo(
                '3d1afd2a-04a2-47f9-9c65-e34b6465b83a',
            );
            expect(searchService.removeVideo).toHaveBeenCalled();
        });

        it('Deletes the correct search index', async () => {
            await videoDataService.deleteVideo(
                '3d1afd2a-04a2-47f9-9c65-e34b6465b83a',
            );
            expect(searchService.removeVideo).toHaveBeenCalledWith(
                '3d1afd2a-04a2-47f9-9c65-e34b6465b83a',
            );
        });

        it('Deletes the video content', async () => {
            await videoDataService.deleteVideo(
                '3d1afd2a-04a2-47f9-9c65-e34b6465b83a',
            );
            expect(videoContentService.deleteVideo).toHaveBeenCalled();
        });

        it('Deletes the correct video content', async () => {
            await videoDataService.deleteVideo(
                '3d1afd2a-04a2-47f9-9c65-e34b6465b83a',
            );
            expect(videoContentService.deleteVideo).toHaveBeenCalledWith(
                'b5263a52-1c05-4ab7-813d-65b8866bacfd',
            );
        });

        it("Doesn't try to delete video content if it does't exist", async () => {
            sharedInstances.mockData.mockImplementation(() => {
                const retVal: {
                    id: '3d1afd2a-04a2-47f9-9c65-e34b6465b83a';
                    author: 'FDJIVPG1xgXfXmm67ETETSn9MSe2';
                    channel: '716886dd-c107-4bd7-9060-a47b50f81689';
                    content: null;
                    description: 'Test Video Description';
                    title: 'Test Video Name';
                    uploadDate: 1578009691;
                } = {
                    id: '3d1afd2a-04a2-47f9-9c65-e34b6465b83a',
                    author: 'FDJIVPG1xgXfXmm67ETETSn9MSe2',
                    channel: '716886dd-c107-4bd7-9060-a47b50f81689',
                    content: null,
                    description: 'Test Video Description',
                    title: 'Test Video Name',
                    uploadDate: 1578009691,
                }; // Work around for TS
                return retVal;
            });
            await videoDataService.deleteVideo(
                '3d1afd2a-04a2-47f9-9c65-e34b6465b83a',
            );
            expect(videoContentService.deleteVideo).not.toHaveBeenCalled();
        });

        it('Deletes the video record', async () => {
            await videoDataService.deleteVideo(
                '3d1afd2a-04a2-47f9-9c65-e34b6465b83a',
            );
            expect(sharedInstances.mockDelete).toHaveBeenCalled();
        });
    });
});
