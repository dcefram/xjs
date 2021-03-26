import Xjs from '../xjs/xjs';

/**
 * Minimize the extension plugin's window
 * @param xjs The Xjs instance
 */
export default function minimize(xjs: Xjs): void {
  xjs.internal.execSync('PostMessageToParent', 'system,274', '61472', '0');
}
