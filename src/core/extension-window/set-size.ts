import Xjs from '../xjs/xjs';

/**
 * Override the default extension plugin window size
 * @param xjs     The Xjs instance
 * @param width   Width in pixels
 * @param height  Height in pixels
 */
export default function setWindowSize(
  xjs: Xjs,
  width: number,
  height: number
): void {
  xjs.internal.execSync(
    'PostMessageToParent',
    '2',
    String(width),
    String(height)
  );
}

/**
 * Sets the minimum window size that the user can resize your plugin window
 * @param xjs     The Xjs instance
 * @param width   Width in pixels
 * @param height  Height in pixels
 */
export function setMinimumWindowSize(
  xjs: Xjs,
  width: number,
  height: number
): void {
  xjs.internal.execSync(
    'PostMessageToParent',
    '6',
    String(width),
    String(height)
  );
}

/**
 * Sets the maximum window size that the user can resize your plugin window
 * @param xjs     The Xjs instance
 * @param width   Width in pixels
 * @param height  Height in pixels
 */
export function setMaximumWindowSize(
  xjs: Xjs,
  width: number,
  height: number
): void {
  xjs.internal.execSync(
    'PostMessageToParent',
    '13',
    String(width),
    String(height)
  );
}
