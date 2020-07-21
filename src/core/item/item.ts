import parser from 'fast-xml-parser';

import Xjs from 'core/xjs';
import Environment from 'helpers/environment';
import { InvalidParamError } from 'internal/errors';

import {
  IPropertyParam,
  IPropertyType,
  IItemInfo,
  IPlacement,
  IItem,
} from './types';

/**
 * The Item class provides methods to get and set properties of an item
 *
 * @example
 *
 * ```ts
 * import Xjs from '@xjsframework/xjs';
 * import Item from '@xjsframework/xjs/core/app';
 * import ItemProps from '@xjsframework/xjs/props/item-props';
 *
 * const xjs = new Xjs();
 * const item = new Item(xjs);
 *
 * const { id, srcId } = await item.getCurrentItem();
 * item.setProperty(ItemProps.customName, { id, srcId, value: 'SomeName' });
 * ```
 */
class Item {
  private internal;

  constructor(config: Xjs) {
    this.internal = config.internal;
  }

  private async getPlacements(): Promise<IPlacement[]> {
    const presentationXml = await this.internal.exec(
      'AppGetPropertyAsync',
      'sceneconfig'
    );
    const presentationObj = parser.parse(presentationXml, {
      attributeNamePrefix: '',
      ignoreAttributes: false,
    });

    if (!presentationObj || !presentationObj.configuration) {
      return [];
    }

    return presentationObj.configuration.placement || [];
  }

  private async isCurrentItem(srcid): Promise<boolean> {
    const _srcid = await this.internal.exec(
      'GetLocalPropertyAsync',
      'prop:srcid'
    );
    return srcid === _srcid;
  }

  private async getLinkedItem(srcid: string): Promise<string> {
    const itemIds = await this.getItemList(srcid);

    if (itemIds.length > 0) {
      return itemIds[0];
    }

    return '';
  }

  /**
   * Get the linked item ids of the specified source.
   *
   * @param srcid Source ID
   */
  async getItemList(srcid: string): Promise<string[]> {
    const placements = await this.getPlacements();

    // O(n^2)
    return placements.reduce((stack: string[], scene: IPlacement) => {
      const placementItem = scene.item || [];
      const sceneItems: IItem[] = Array.isArray(placementItem)
        ? placementItem
        : [placementItem];

      const linkedItems: string[] = sceneItems
        .filter(item => item.srcid === srcid)
        .map(item => item.id);

      return [...stack, ...linkedItems];
    }, []);
  }

  /**
   * Get the source ID and the item ID of the current item
   */
  async getCurrentItem(): Promise<IItemInfo> {
    if (Environment.isExtension) {
      throw new Error('You cannot use `getCurrentItem` in an extension plugin');
    }

    const itemsString = await this.internal.exec(
      'GetLocalPropertyAsync',
      'itemlist'
    );
    const srcid = await this.internal.exec(
      'GetLocalPropertyAsync',
      'prop:srcid'
    );
    const items = itemsString.split(',');

    if (items.length === 0) {
      throw new Error(
        'Cannot get current item, itemlist did not return any ID'
      );
    }

    return { srcid, id: items[0] };
  }

  /**
   * Set item property
   *
   * @param prop Item Property object
   * @param param Params that would be passed to the underlying core function
   */
  async setProperty(
    prop: IPropertyType,
    param: IPropertyParam
  ): Promise<string> {
    if (typeof param.id === 'undefined' || typeof param.srcid === 'undefined') {
      throw new InvalidParamError(
        'param should be an object with an `id` and `srcid` property'
      );
    }

    if (
      typeof prop.setValidator !== 'function' ||
      prop.setValidator(param.value)
    ) {
      const attachKey = Environment.isSourcePlugin
        ? 'AttachVideoItem1'
        : 'SearchVideoItem';
      const funcKey = Environment.isSourcePlugin
        ? 'SetLocalPropertyAsync1'
        : 'SetLocalPropertyAsync';

      this.internal.exec(attachKey, param.id);

      const result = await this.internal.exec(
        funcKey,
        prop.key,
        typeof prop.setTransformer !== 'function'
          ? param.value
          : prop.setTransformer(param.value)
      );

      // deadcoldbrain noted that it is much safer if we do this comparison,
      // checking for both the string "null" and the actual null value.
      // @TODO: If core always returns null, this would cause a callstack exceeded error
      // Address this before releasing 3.x, if it is something to worry about.
      if (!isNaN(result) && Number(result) < 0) {
        console.warn(
          'Attached item does not exist. Attempting to attach linked item...'
        );

        const id = await this.getLinkedItem(param.srcid);

        if (id) {
          return this.setProperty(prop, { ...param, id });
        } else {
          console.error('Failed to find linked item.');
        }
      } else {
        return result;
      }
    }

    // Shouldn't reach here unless a custom property does not throw an error on its validator
    throw new InvalidParamError(`Params "${param}" validation failed`);
  }

  /**
   * Get item property
   *
   * @param prop Item Property object
   * @param param Params that would be used to modify the property key
   */
  async getProperty(
    prop: IPropertyType,
    param: IPropertyParam
  ): Promise<unknown> {
    if (typeof param.id === 'undefined' || typeof param.srcid === 'undefined') {
      throw new InvalidParamError(
        'param should be an object with an `id` and `srcid` property'
      );
    }

    if (
      typeof prop.getValidator !== 'function' ||
      prop.getValidator(param.value)
    ) {
      const attachKey = Environment.isSourcePlugin
        ? 'AttachVideoItem1'
        : 'SearchVideoItem';
      const funcKey = Environment.isSourcePlugin
        ? 'GetLocalPropertyAsync1'
        : 'GetLocalPropertyAsync';

      this.internal.exec(attachKey, param.id);

      const result = await this.internal.exec(funcKey, prop.key);

      // deadcoldbrain noted that it is much safer if we do this comparison,
      // checking for both the string "null" and the actual null value.
      // @TODO: If core always returns null, this would cause a callstack exceeded error
      // Address this before releasing 3.x, if it is something to worry about.
      if (result === null || result === 'null') {
        console.warn(
          'Attached item does not exaist. Attempting to attach linked item...'
        );

        const id = await this.getLinkedItem(param.srcid);

        if (id) {
          return this.getProperty(prop, { ...param, id });
        } else {
          console.error('Failed to find linked item.');
        }
      } else {
        return typeof prop.getTransformer !== 'function'
          ? result
          : prop.getTransformer(result);
      }
    }

    // Shouldn't reach here unless a custom property does not throw an error on its validator
    throw new InvalidParamError(`Params "${param}" validation failed`);
  }

  /**
   * Set an item's configuration
   *
   * @param config A generic JSON object that would be persisted in the presentation
   * @param info Item ID and Source ID
   */
  setConfiguration(config: Record<string, unknown>, info: IItemInfo): void {
    if (!Environment.isSourcePlugin) {
      throw new Error('You can only set configuration in source plugins');
    }

    if (!this.isCurrentItem(info.srcid)) {
      throw new Error('You can only set configuration for the current item');
    }

    this.internal.exec(
      'SetBrowserProperty',
      'Configuration',
      JSON.stringify(config)
    );
  }

  /**
   * Get an item's configuration
   *
   * @param info Item ID and Source ID
   */
  async getConfiguration(
    info: IItemInfo
  ): Promise<Record<string, unknown> | string> {
    if (Environment.isExtension) {
      throw new Error('You cannot set configuration in extension plugins');
    }

    if (!this.isCurrentItem(info.srcid)) {
      throw new Error('You can only get configuration for the current item');
    }

    let result = await this.internal.exec(
      'GetLocalPropertyAsync',
      'prop:BrowserConfiguration'
    );

    if (!result || result === 'null') {
      result = await this.internal.exec('GetConfiguration');
    }

    return JSON.parse(result || '{}');
  }
}

export default Item;
