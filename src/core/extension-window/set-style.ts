import Xjs from '../xjs/xjs';

/**
 * Supported window styles. This is a subset of the native window styles defined in [MSDN](https://docs.microsoft.com/en-us/windows/win32/winmsg/window-styles)
 * An additional window style flag is used for enabling/disabling the close button.
 */
export enum WINDOW_STYLES {
  CLOSE = -5, // This does not exist in the native window styles
  BORDER = 1,
  CAPTION = 2,
  SIZING = 4,
  MINIMIZE = 8,
  MAXIMIZE = 16,
}

/**
 * The default window style of the extension window is usually all the available window styles enabled. This method
 * allows you to override that and only enable the styles that you want
 * @param xjs     The Xjs instance
 * @param styles  Array of window styles that you want to enable. See available window styles: {@link WINDOW_STYLES}
 */
export default function setWindowStyle(
  xjs: Xjs,
  styles: WINDOW_STYLES[]
): void {
  const customStyles = Object.keys(WINDOW_STYLES)
    .filter((value) => !isNaN(Number(value)))
    .reduce((stack, value) => ({ [value]: 0 }), {});
  const computed = styles
    .reduce((final, style) => {
      if (style >= 0) return final + style;
      customStyles[style] = 1;
      return final;
    }, 0)
    .toString();

  xjs.internal.execSync('PostMessageToParent', '4', computed);

  Object.entries(customStyles).forEach(([key, value]) => {
    xjs.internal.execSync(
      'PostMessageToParent',
      String(Number(key) * -1),
      String(value)
    );
  });
}
