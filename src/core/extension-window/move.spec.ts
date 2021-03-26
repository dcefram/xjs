import { mocked } from 'ts-jest/utils';

import Xjs from 'core/xjs';
import move from './move';
import Internal from 'internal';

jest.mock('internal');

const mockInternal = mocked(Internal, true);

describe('Extension Window move', () => {
  let xjs;

  beforeEach(() => {
    mockInternal.mockClear();
    xjs = new Xjs();
  });

  it('should send the "move" flag to core', async () => {
    move(xjs);

    const mockedInstance = mockInternal.mock.instances[0];
    expect(mockedInstance.execSync).toHaveBeenCalledWith(
      'PostMessageToParent',
      '12'
    );
  });
});
