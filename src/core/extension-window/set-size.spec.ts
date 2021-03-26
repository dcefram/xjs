import { mocked } from 'ts-jest/utils';

import Xjs from 'core/xjs';
import setSize, {
  setMaximumWindowSize,
  setMinimumWindowSize,
} from './set-size';
import Internal from 'internal';

jest.mock('internal');

const mockInternal = mocked(Internal, true);

describe('Extension Window size', () => {
  let xjs;

  beforeEach(() => {
    mockInternal.mockClear();
    xjs = new Xjs();
  });

  describe('setSize', () => {
    it('should send the dimensions to core', async () => {
      setSize(xjs, 1, 2);

      const mockedInstance = mockInternal.mock.instances[0];
      expect(mockedInstance.execSync).toHaveBeenCalledWith(
        'PostMessageToParent',
        '2',
        '1',
        '2'
      );
    });
  });

  describe('setMaximumWindowSize', () => {
    it('should send the dimensions to core', async () => {
      setMaximumWindowSize(xjs, 1, 2);

      const mockedInstance = mockInternal.mock.instances[0];
      expect(mockedInstance.execSync).toHaveBeenCalledWith(
        'PostMessageToParent',
        '13',
        '1',
        '2'
      );
    });
  });

  describe('setMinimumWindowSize', () => {
    it('should send the dimensions to core', async () => {
      setMinimumWindowSize(xjs, 1, 2);

      const mockedInstance = mockInternal.mock.instances[0];
      expect(mockedInstance.execSync).toHaveBeenCalledWith(
        'PostMessageToParent',
        '6',
        '1',
        '2'
      );
    });
  });
});
