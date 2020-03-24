import { ObjectWritableMock } from 'stream-mock';

// Mock Firestore
export const mockDoc = jest.fn();
export const mockCollection = jest.fn();
export const mockGet = jest.fn();
export const mockSet = jest.fn();
export const mockWhere = jest.fn();
export const mockUpdate = jest.fn();
export const mockDelete = jest.fn();
export const mockMap = jest.fn(() => []);
// Optionally overriden
export const mockExists = jest.fn(() => true);
// mockData should have it's implementation overriden by the unit test
export const mockData = jest.fn();

export class MockedFirestore {
    get exists() {
        return mockExists();
    }
    public data = mockData;
    public delete = mockDelete;
    public docs = this;
    public map = mockMap;
    doc() {
        mockDoc(...arguments);
        return this;
    }
    collection() {
        mockCollection(...arguments);
        return this;
    }
    get() {
        mockGet(...arguments);
        return new Promise((resolve) => {
            process.nextTick(() => {
                resolve(this);
            });
        });
    }
    set() {
        mockSet(...arguments);
        return new Promise((resolve) => {
            process.nextTick(() => {
                resolve();
            });
        });
    }
    update() {
        mockUpdate(...arguments);
        return new Promise((resolve) => {
            process.nextTick(() => {
                resolve();
            });
        });
    }
    where() {
        mockWhere(...arguments);
        return this;
    }
}

export const firestoreInstance = new MockedFirestore();

// Mock Storage
export const mockBucket = jest.fn();
export const mockFile = jest.fn();
export const mockCreateWriteStream = jest.fn();
export const mockStreamWritten = jest.fn();
export const mockMakePublic = jest.fn();
export const mockedWriteStream = new ObjectWritableMock();

export class MockedStorage {
    bucket() {
        mockBucket(...arguments);
        return this;
    }
    file() {
        mockFile(...arguments);
        return this;
    }
    createWriteStream() {
        mockCreateWriteStream(...arguments);
        return mockedWriteStream;
    }
    makePublic() {
        mockMakePublic(...arguments);
        return new Promise((resolve) => {
            process.nextTick(() => {
                resolve(this);
            });
        });
    }
}

export const storageInstance = new MockedStorage();

// Mock Algolia
export const mockSaveObject = jest.fn();
export const mockDeleteObject = jest.fn();

export class MockedAlgolia {
    saveObject() {
        mockSaveObject(...arguments);
        return new Promise((resolve) => {
            process.nextTick(() => {
                resolve();
            });
        });
    }

    deleteObject() {
        mockDeleteObject(...arguments);
        return new Promise((resolve) => {
            process.nextTick(() => {
                resolve();
            });
        });
    }
}

export const algoliaClientInstance = {};
export const algoliaIndexInstance = new MockedAlgolia();

// Mock PubSub
export class MockPubSubSubscription {
    on() {}
}
export const pubsubSubscriptionID =
    process.env.MUXEVENTSUBSCRIPTIONID || 'swish-api';
export const pubsubClient = {};
export const pubsubSubscription = new MockPubSubSubscription();
