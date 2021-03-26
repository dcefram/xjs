import Xjs from '../xjs/xjs';

/**
 * Maximize the extension plugin's window
 * @param xjs The Xjs instance
 */
export default function maximize(xjs: Xjs): void {
  xjs.internal.execSync('PostMessageToParent', 'system,274', '61488', '0');
}
