import { mocked } from 'ts-jest/utils';

import Xjs from 'core/xjs';
import getMode from './get-mode';
import Internal from 'internal';

jest.mock('internal');

const mockInternal = mocked(Internal, true);

describe('Extension Window getMode', () => {
  let xjs;

  beforeEach(() => {
    mockInternal.mockClear();
    xjs = new Xjs();
  });

  it('should send the get mode flag to core', async () => {
    getMode(xjs);

    const mockedInstance = mockInternal.mock.instances[0];
    expect(mockedInstance.execWithCallback).toHaveBeenCalledWith(
      'PostMessageToParent',
      'Setconfig',
      '10'
    );
  });
});
