import { mocked } from 'ts-jest/utils';

import Xjs from 'core/xjs';
import setStyle, { WINDOW_STYLES } from './set-style';
import Internal from 'internal';

jest.mock('internal');

const mockInternal = mocked(Internal, true);

describe('Extension Window setStyle', () => {
  let xjs;

  beforeEach(() => {
    mockInternal.mockClear();
    xjs = new Xjs();
  });

  it('should disable all styles if empty array is passed', async () => {
    setStyle(xjs);

    const mockedInstance = mockInternal.mock.instances[0];
    expect(mockedInstance.execSync).toHaveBeenCalledWith(
      'PostMessageToParent',
      '4',
      '0'
    );
    expect(mockedInstance.execSync).toHaveBeenCalledWith(
      'PostMessageToParent',
      '5',
      '0'
    );
  });

  it('should enable only border if border is passed', async () => {
    setStyle(xjs, [WINDOW_STYLES.BORDER]);

    const mockedInstance = mockInternal.mock.instances[0];
    expect(mockedInstance.execSync).toHaveBeenCalledWith(
      'PostMessageToParent',
      '4',
      '1'
    );
    expect(mockedInstance.execSync).toHaveBeenCalledWith(
      'PostMessageToParent',
      '5',
      '0'
    );
  });

  it('should enable only caption if caption is passed', async () => {
    setStyle(xjs, [WINDOW_STYLES.CAPTION]);

    const mockedInstance = mockInternal.mock.instances[0];
    expect(mockedInstance.execSync).toHaveBeenCalledWith(
      'PostMessageToParent',
      '4',
      '2'
    );
    expect(mockedInstance.execSync).toHaveBeenCalledWith(
      'PostMessageToParent',
      '5',
      '0'
    );
  });

  it('should enable only close if close is passed', async () => {
    setStyle(xjs, [WINDOW_STYLES.CLOSE]);

    const mockedInstance = mockInternal.mock.instances[0];
    expect(mockedInstance.execSync).toHaveBeenCalledWith(
      'PostMessageToParent',
      '4',
      '0'
    );
    expect(mockedInstance.execSync).toHaveBeenCalledWith(
      'PostMessageToParent',
      '5',
      '1'
    );
  });

  it('should enable only maximize if maximize is passed', async () => {
    setStyle(xjs, [WINDOW_STYLES.MAXIMIZE]);

    const mockedInstance = mockInternal.mock.instances[0];
    expect(mockedInstance.execSync).toHaveBeenCalledWith(
      'PostMessageToParent',
      '4',
      '16'
    );
    expect(mockedInstance.execSync).toHaveBeenCalledWith(
      'PostMessageToParent',
      '5',
      '0'
    );
  });

  it('should enable only minimize if minimize is passed', async () => {
    setStyle(xjs, [WINDOW_STYLES.MINIMIZE]);

    const mockedInstance = mockInternal.mock.instances[0];
    expect(mockedInstance.execSync).toHaveBeenCalledWith(
      'PostMessageToParent',
      '4',
      '8'
    );
    expect(mockedInstance.execSync).toHaveBeenCalledWith(
      'PostMessageToParent',
      '5',
      '0'
    );
  });

  it('should enable only sizing if sizing is passed', async () => {
    setStyle(xjs, [WINDOW_STYLES.SIZING]);

    const mockedInstance = mockInternal.mock.instances[0];
    expect(mockedInstance.execSync).toHaveBeenCalledWith(
      'PostMessageToParent',
      '4',
      '4'
    );
    expect(mockedInstance.execSync).toHaveBeenCalledWith(
      'PostMessageToParent',
      '5',
      '0'
    );
  });

  it('should enable a combination of window states if multiple are enabled', async () => {
    setStyle(xjs, [
      WINDOW_STYLES.BORDER,
      WINDOW_STYLES.CLOSE,
      WINDOW_STYLES.MINIMIZE,
      WINDOW_STYLES.MAXIMIZE,
    ]);

    const mockedInstance = mockInternal.mock.instances[0];
    expect(mockedInstance.execSync).toHaveBeenCalledWith(
      'PostMessageToParent',
      '4',
      '25'
    );
    expect(mockedInstance.execSync).toHaveBeenCalledWith(
      'PostMessageToParent',
      '5',
      '1'
    );
  });
});
