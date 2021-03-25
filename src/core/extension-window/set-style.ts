/**
 * Extension plugin window styles, similar format with native Window Styles constants
 * https://docs.microsoft.com/en-us/windows/win32/winmsg/window-styles
 */
import Xjs from '../xjs/xjs';

export enum WINDOW_STYLES {
  BORDER = 1,
  CAPTION = 2,
  SIZING = 4,
  MINIMIZE = 8,
  MAXIMIZE = 16,
}

export default function setWindowStyle(
  xjs: Xjs,
  styles: WINDOW_STYLES[]
): void {
  const computed = styles.reduce((final, style) => final + style, 0).toString();
  xjs.internal.execSync('PostMessageToParent', '4', computed);
}
