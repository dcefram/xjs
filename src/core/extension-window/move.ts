import Xjs from '../xjs/xjs';

/**
 * Move the extension plugin's window
 * @param xjs The Xjs instance
 */
export default function move(xjs: Xjs): void {
  xjs.internal.execSync('PostMessageToParent', '12');
}
