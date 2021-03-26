import { mocked } from 'ts-jest/utils';

import Xjs from 'core/xjs';
import minimize from './minimize';
import Internal from 'internal';

jest.mock('internal');

const mockInternal = mocked(Internal, true);

describe('Extension Window minimize', () => {
  let xjs;

  beforeEach(() => {
    mockInternal.mockClear();
    xjs = new Xjs();
  });

  it('should send the "maximize" flag to core', async () => {
    minimize(xjs);

    const mockedInstance = mockInternal.mock.instances[0];
    expect(mockedInstance.execSync).toHaveBeenCalledWith(
      'PostMessageToParent',
      'system,274',
      '61472',
      '0'
    );
  });
});
