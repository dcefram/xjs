/**
 * Extension plugin window styles, similar format with native Window Styles constants
 * https://docs.microsoft.com/en-us/windows/win32/winmsg/window-styles
 */
import Xjs from '../xjs/xjs';

// This is a naive implementation

export default async function setWindowTitle(
  xjs: Xjs,
  title: string,
  id?: string
): Promise<void> {
  let _id: string | undefined = id;

  if (typeof _id === 'undefined') {
    _id = (await xjs.internal.execWithCallback(
      'PostMessageToParent',
      'SetId',
      '8'
    )) as string;
  }
  xjs.internal.execSync('CallHost', `setExtensionWindowTitle:${_id}`, title);
}
