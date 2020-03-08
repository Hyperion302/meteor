import * as videoContentService from './';
import { IVideoContent } from './definitions';

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
    describe('uploadVideo', () => {});
});
