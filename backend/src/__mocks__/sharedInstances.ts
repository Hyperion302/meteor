// Mock Firestore

const firestoreDB: any = {
    videos: {
        '3d1afd2a-04a2-47f9-9c65-e34b6465b83a': {
            id: '3d1afd2a-04a2-47f9-9c65-e34b6465b83a',
            author: 'FDJIVPG1xgXfXmm67ETETSn9MSe2',
            channel: '716886dd-c107-4bd7-9060-a47b50f81689',
            content: 'b5263a52-1c05-4ab7-813d-65b8866bacfd',
            description: 'Test Video Description',
            title: 'Test Video Name',
            uploadDate: 1578009691,
        },
    },
    channels: {
        '716886dd-c107-4bd7-9060-a47b50f81689': {
            id: '716886dd-c107-4bd7-9060-a47b50f81689',
            name: 'Test Channel',
            owner: 'FDJIVPG1xgXfXmm67ETETSn9MSe2',
        },
    },
    content: {
        'b5263a52-1c05-4ab7-813d-65b8866bacfd': {
            id: 'b5263a52-1c05-4ab7-813d-65b8866bacfd',
            assetID: 'SNW1q1R01PdIkf26Kn01DIKAgYtq2qgWRo',
            playbackID: '1ZjsLIn0167NzZ02TGbbGEngvGbMCAA00sG',
        },
    },
};

class FakeFirestoreDocSnap {
    name: string;
    collection: string;
    path: string;
    exists: boolean;
    constructor(path: string) {
        this.path = path;
        // Get name out of path (I know we don't have nested collections so this will do)
        const pathElements: string[] = path.split('/');
        this.name = pathElements[1];
        this.collection = pathElements[0];
        if (
            Object.keys(firestoreDB).includes(this.collection) && // Collection exists
            Object.keys(firestoreDB[this.collection]).includes(this.name) // Doc exists in collection
        ) {
            this.exists = true;
        } else {
            this.exists = false;
        }
    }
    data = jest.fn(() => {
        return firestoreDB[this.collection][this.name];
    });
}

class FakeFirestoreDoc {
    path: string;
    constructor(path: string) {
        this.path = path;
    }
    public get = jest.fn(() => {
        return new Promise((resolve, reject) => {
            resolve(new FakeFirestoreDocSnap(this.path));
        });
    });
}

class FakeFirestoreQuerySnap {}

class FakeFirestoreCollection {
    public where = jest.fn(() => {
        return this;
    });
    public get = jest.fn(() => {
        return new Promise((resolve, reject) => {
            resolve(new FakeFirestoreQuerySnap());
        });
    });
}

class FakeFirestore {
    public doc = jest.fn((path: string) => {
        return new FakeFirestoreDoc(path);
    });
    public collection = jest.fn(() => {
        return new FakeFirestoreCollection();
    });
}

export const firestoreInstance = new FakeFirestore();
