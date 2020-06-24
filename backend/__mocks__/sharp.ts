import { DuplexMock } from 'stream-mock';

export const mockedPNG = jest.fn();
export const mockedClone = jest.fn();
export const mockedResize = jest.fn();

export class SharpInstance extends DuplexMock {
  png() {
    mockedPNG(...arguments);
    return this;
  }
  clone() {
    mockedClone(...arguments);
    return this;
  }
  resize() {
    mockedResize(...arguments);
    return this;
  }
}

export const mockedSharp = new SharpInstance();

export default jest.fn(() => mockedSharp);
