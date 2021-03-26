import { mocked } from 'ts-jest/utils';

import Xjs from 'core/xjs';
import setTitle from './set-title';
import Internal from 'internal';

jest.mock('internal');

const mockInternal = mocked(Internal, true);

describe('Extension Window setTitle', () => {
  let xjs;

  beforeEach(() => {
    mockInternal.mockClear();
    xjs = new Xjs();
  });

  it('should send the "setTitle" flag to core', async () => {
    await setTitle(xjs, 'abc');

    const mockedInstance = mockInternal.mock.instances[0];
    expect(mockedInstance.execWithCallback).toHaveBeenCalledWith(
      'PostMessageToParent',
      'SetId',
      '8'
    );
    expect(mockedInstance.execSync).toHaveBeenCalledWith(
      'CallHost',
      'setExtensionWindowTitle:undefined',
      'abc'
    );
  });
});
