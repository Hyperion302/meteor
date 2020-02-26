// Mock Firestore
export const mockDoc = jest.fn();
export const mockCollection = jest.fn();
export const mockGet = jest.fn();
export const mockSet = jest.fn();
export const mockWhere = jest.fn();
export const mockUpdate = jest.fn();
export const mockDelete = jest.fn();
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
