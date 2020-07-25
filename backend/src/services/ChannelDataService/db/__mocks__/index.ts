export const mockSelect = jest.fn();
export const mockFrom = jest.fn();
export const mockWhere = jest.fn();
export const mockTable = jest.fn();
export const mockUpdate = jest.fn();
export const mockInsert = jest.fn();
export const mockDel = jest.fn();
export const mockResponse = jest.fn(() => []);
export const mockCatch = jest.fn();

export class MockKnex {
  public select = mockSelect.mockReturnThis();
  public from = mockFrom.mockReturnThis();
  public where = mockWhere.mockReturnThis();
  public table = mockTable.mockReturnThis();
  public update = mockUpdate.mockReturnThis();
  public insert = mockInsert.mockReturnThis();
  public del = mockDel.mockReturnThis();
  public then = (done: any) => {
    done(mockResponse());
  };
  public catch = mockCatch();
}

export const knexInstance = new MockKnex();
