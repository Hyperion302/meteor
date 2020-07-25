import { ObjectWritableMock } from 'stream-mock';
import { Callback } from 'redis';
import { SwishflakeGenerator } from '@/SwishflakeGenerator';

// Mock appConfig
export const mockConfig = jest.fn(() => {
  return {
    environment: 'dev',
    searchIndex: 'dev_swish',
    bucket: 'dev-swish',
    dbPrefix: 'dev',
    muxSubscription: 'dev-swish-api',
    sql: {
      host: '',
      pass: '',
      databases: {
        channelData: '',
        videoContent: '',
        videoData: '',
      },
    },
  };
});
export class MockedAppConfig {
  get environment() {
    return mockConfig().environment;
  }
  get searchIndex() {
    return mockConfig().searchIndex;
  }
  get bucket() {
    return mockConfig().bucket;
  }
  get dbPrefix() {
    return mockConfig().dbPrefix;
  }
  get muxSubscription() {
    return mockConfig().muxSubscription;
  }
  get sql() {
    return mockConfig().sql;
  }
}
export const appConfig = new MockedAppConfig();

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

// Mock Redis
export const mockRedisGet = jest.fn((key: string) => {
  return { reply: 'OK', err: null };
});
export const mockRedisHget = jest.fn((key: string, field: string) => {
  return { reply: 'OK', err: null };
});
export const mockRedisHset = jest.fn(
  (key: string, field: string, value: string) => {
    return { reply: 0, err: null };
  },
);
export const mockRedisHincrby = jest.fn(
  (key: string, field: string, increment: number) => {
    return { reply: 'OK', err: null };
  },
);
export const mockRedisIncrbyfloat = jest.fn(
  (key: string, increment: number) => {
    return { reply: 'OK', err: null };
  },
);
export const mockRedisSetbit = jest.fn(
  (key: string, offset: number, bit: string) => {
    return { reply: 0, err: null };
  },
);
export const mockRedisDel = jest.fn((key: string) => {
  return { reply: 'OK', err: null };
});
export const mockRedisScan = jest.fn((cursor: string) => {
  return { reply: null, err: null };
});
export const mockRedisSet = jest.fn((key: string, value: string) => {
  return { reply: 'OK', err: null };
});
export const mockRedisWatch = jest.fn((key: string | string[]) => {
  return { err: null };
});
export const mockRedisMulti = jest.fn();
export const mockRedisExec = jest.fn(() => {
  return { reply: null, err: null };
});
export class MockedRedis {
  // For these functions I lock the arguments since util.promisify is very dependent on them
  get(key: string, cb?: Callback<string>) {
    const { reply, err } = mockRedisGet(key);
    process.nextTick(() => {
      if (cb) cb(err, reply);
    });
  }
  hget(key: string, field: string, cb?: Callback<string>) {
    const { reply, err } = mockRedisHget(key, field);
    process.nextTick(() => {
      if (cb) cb(err, reply);
    });
  }
  hset(key: string, field: string, value: string, cb?: Callback<number>) {
    const { reply, err } = mockRedisHset(key, field, value);
    process.nextTick(() => {
      if (cb) cb(err, reply);
    });
  }
  hincrby(
    key: string,
    field: string,
    increment: number,
    cb?: Callback<string>,
  ) {
    const { reply, err } = mockRedisHincrby(key, field, increment);
    process.nextTick(() => {
      if (cb) cb(err, reply);
    });
  }
  incrbyfloat(key: string, increment: number, cb?: Callback<string>) {
    const { reply, err } = mockRedisIncrbyfloat(key, increment);
    process.nextTick(() => {
      if (cb) cb(err, reply);
    });
  }
  setbit(key: string, offset: number, value: string, cb?: Callback<number>) {
    const { reply, err } = mockRedisSetbit(key, offset, value);
    process.nextTick(() => {
      if (cb) cb(err, reply);
    });
  }
  del(key: string, cb?: Callback<string>) {
    const { reply, err } = mockRedisDel(key);
    process.nextTick(() => {
      if (cb) cb(err, reply);
    });
  }
  scan(cursor: string, cb?: Callback<[string[]]>) {
    const { reply, err } = mockRedisScan(cursor);
    process.nextTick(() => {
      if (cb) cb(err, reply);
    });
  }
  set(key: string, value: string, cb?: Callback<'OK'>) {
    const { err } = mockRedisSet(key, value);
    process.nextTick(() => {
      if (cb) cb(err, 'OK');
    });
  }
  watch(key: string | string[], cb?: Callback<'OK'>) {
    const { err } = mockRedisWatch(key);
    process.nextTick(() => {
      cb(err, 'OK');
    });
  }
  multi() {
    mockRedisMulti();
    return this;
  }
  exec(cb: Callback<any[]>) {
    const { err, reply } = mockRedisExec();
    process.nextTick(() => {
      cb(err, reply);
    });
  }
}

export const redisClient = new MockedRedis();

// Mock Swishflake
export const mockID = jest.fn(() => '');
export class MockSwishflakeGenerator {
  nextID() {
    return mockID();
  }
}
export const swishflakeGenerator = new MockSwishflakeGenerator();
