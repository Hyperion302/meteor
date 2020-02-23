import * as videoDataService from './';
import { firestoreInstance } from '../../sharedInstances';

jest.mock('../../sharedInstances');

describe('Video Data Service', () => {
    describe('getVideo', () => {
        it('requests the correct video ID', async () => {
            await videoDataService.getVideo(
                '3d1afd2a-04a2-47f9-9c65-e34b6465b83a',
            );
            expect(firestoreInstance.doc).toBeCalledWith(
                'videos/3d1afd2a-04a2-47f9-9c65-e34b6465b83a',
            );
        });
        it('requests the correct channel ID', async () => {
            await videoDataService.getVideo(
                '3d1afd2a-04a2-47f9-9c65-e34b6465b83a',
            );
            expect(firestoreInstance.doc).toBeCalledWith(
                'channels/716886dd-c107-4bd7-9060-a47b50f81689',
            );
        });
        it('requests the correct content ID', async () => {
            await videoDataService.getVideo(
                '3d1afd2a-04a2-47f9-9c65-e34b6465b83a',
            );
            expect(firestoreInstance.doc).toBeCalledWith(
                'content/b5263a52-1c05-4ab7-813d-65b8866bacfd',
            );
        });
        it('responds with the correct video', async () => {
            const res = await videoDataService.getVideo(
                '3d1afd2a-04a2-47f9-9c65-e34b6465b83a',
            );
            expect(res.author).toBe('FDJIVPG1xgXfXmm67ETETSn9MSe2');
            expect(res.description).toBe('Test Video Description');
            expect(res.title).toBe('Test Video Name');
            expect(res.id).toBe('3d1afd2a-04a2-47f9-9c65-e34b6465b83a');
            expect(res.uploadDate).toBe(1578009691);
            // Channel
            expect(res.channel.id).toBe('716886dd-c107-4bd7-9060-a47b50f81689');
            expect(res.channel.name).toBe('Test Channel');
            expect(res.channel.owner).toBe('FDJIVPG1xgXfXmm67ETETSn9MSe2');
            // Content
            expect(res.content.id).toBe('b5263a52-1c05-4ab7-813d-65b8866bacfd');
            expect(res.content.assetID).toBe(
                'SNW1q1R01PdIkf26Kn01DIKAgYtq2qgWRo',
            );
            expect(res.content.playbackID).toBe(
                '1ZjsLIn0167NzZ02TGbbGEngvGbMCAA00sG',
            );
        });
    });
    describe('queryVideo', () => {});
});
