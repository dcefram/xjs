import Xjs from '../xjs';
import Item from '../item';
import Environment from '../../helpers/environment';

export default async function getCurrentItem(xjs: Xjs): Promise<Item | null> {
  if (!xjs) {
    throw new Error('Missing XJS instance');
  }

  if (Environment.isExtension) {
    throw new Error(
      'Extensions does not have a current plugin item tied to it'
    );
  }

  let response = await xjs._internal.exec('GetLocalPropertyAsync', 'itemlist');
  const items = String(response).split(',');

  if (items[0]) {
    return new Item({
      internal: xjs._internal,
      attributes: { id: items[0] },
      isCurrentItem: true,
    });
  }

  return null;
}
