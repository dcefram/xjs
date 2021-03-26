import { mocked } from 'ts-jest/utils';

import Xjs from 'core/xjs';
import close from './close';
import Internal from 'internal';

jest.mock('internal');

const mockInternal = mocked(Internal, true);

describe('Extension Window close', () => {
  let xjs;

  beforeEach(() => {
    mockInternal.mockClear();
    xjs = new Xjs();
  });

  it('should send the "close" flag to core', async () => {
    close(xjs);

    const mockedInstance = mockInternal.mock.instances[0];
    expect(mockedInstance.execSync).toHaveBeenCalledWith(
      'PostMessageToParent',
      '1'
    );
  });
});
