import Xjs from '../xjs/xjs';

/**
 * Close the extension plugin's window
 * @param xjs The Xjs instance
 */
export default function close(xjs: Xjs): void {
  xjs.internal.execSync('PostMessageToParent', '1');
}
