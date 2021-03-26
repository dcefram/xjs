import Xjs from '../xjs/xjs';

/**
 * TODO: Not yet sure what this is used for
 * @param xjs The Xjs instance
 * @return Promise<unknown>
 */
export default async function getWindowMode(xjs: Xjs): Promise<unknown> {
  return await xjs.internal.execWithCallback(
    'PostMessageToParent',
    'Setconfig',
    '10'
  );
}
