import Xjs from '../xjs/xjs';

/**
 * Specify the text that would show up in the extension plugin window's title bar
 * @param xjs     The Xjs instance
 * @param title   Text that would be displayed in the title bar
 * @param id      Optional. Specify the window ID that you want to modify the title
 */
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
