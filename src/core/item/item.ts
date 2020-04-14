import parser from 'fast-xml-parser';

import Internal from '../../internal';
import Environment from '../../helpers/environment';
import Xjs from '../xjs';

import { ItemConfig, PropertyType } from './types';

class Item {
  private _internal: Internal;
  private _id: string;
  private _srcId: string; // @TODO: To be used by the fallback logic if in case the item ID is gone (ie. deleted from scene, but source still exists)
  private _isCurrentItem: boolean;

  static fromXMLString(xjs: Xjs, xmlString: string) {
    const itemObject = parser.parse(xmlString, {
      attributeNamePrefix: '',
      ignoreAttributes: false,
    });

    // Check if valid XML... we consider it valid if it has an id :D
    if (
      itemObject &&
      itemObject.item &&
      typeof itemObject.item.id !== 'undefined'
    ) {
      return new Item({
        internal: xjs._internal,
        id: itemObject.item.id,
        srcId: itemObject.item.srcid,
      });
    }

    throw new Error('Invalid XML passed to `fromXMLString`');
  }

  constructor(config: ItemConfig) {
    this._internal = config.internal;
    this._id = config.id;
    this._srcId = config.srcId;
    this._isCurrentItem = !!config.isCurrentItem;
  }

  private async getPlacements() {
    const presentationXml = await this._internal.exec(
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

  async getItemList() {
    const placements = await this.getPlacements();

    // O(n^2)
    return placements.reduce((stack: string[], scene: any) => {
      const sceneItems: any[] = scene.item || [];
      const linkedItems: string[] = sceneItems
        .filter(item => item.srcid === this._srcId)
        .map(item => item.id);

      return [...stack, ...linkedItems];
    }, []);
  }

  async getLinkedItem() {
    const placements = await this.getPlacements();

    for (let idx = 0; idx < placements.length; idx++) {
      let items = placements[idx].item || [];

      if (!(items instanceof Array)) {
        items = [items];
      }

      const item = items.find(item => item.srcid === this._srcId);

      if (item) {
        return item.id;
      }
    }

    return '';
  }

  async setProperty(prop: PropertyType, param: any) {
    if (typeof prop.setValidator !== 'function' || prop.setValidator(param)) {
      const attachKey = Environment.isSourcePlugin
        ? 'AttachVideoItem1'
        : 'SearchVideoItem';
      const funcKey = Environment.isSourcePlugin
        ? 'SetLocalPropertyAsync1'
        : 'SetLocalPropertyAsync';

      this._internal.exec(attachKey, this._id);

      const result = await this._internal.exec(
        funcKey,
        prop.key,
        typeof prop.setTransformer !== 'function'
          ? param
          : prop.setTransformer(param)
      );

      // deadcoldbrain noted that it is much safer if we do this comparison,
      // checking for both the string "null" and the actual null value.
      // @TODO: If core always returns null, this would cause a callstack exceeded error
      // Address this before releasing 3.x, if it is something to worry about.
      if (result === null || result === 'null') {
        console.warn(
          'Attached item does not exist. Attempting to attach linked item...'
        );

        this._id = await this.getLinkedItem();

        if (this._id) {
          return this.setProperty(prop, param);
        } else {
          console.error('Failed to find linked item.');
        }
      } else {
        return result;
      }
    }

    throw new Error(`Params "${param}" validation failed`);
  }

  async getProperty(prop: PropertyType, param: any) {
    if (typeof prop.getValidator !== 'function' || prop.getValidator(param)) {
      const attachKey = Environment.isSourcePlugin
        ? 'AttachVideoItem1'
        : 'SearchVideoItem';
      const funcKey = Environment.isSourcePlugin
        ? 'GetLocalPropertyAsync1'
        : 'GetLocalPropertyAsync';

      this._internal.exec(attachKey, this._id);

      const result = await this._internal.exec(funcKey, prop.key);

      // deadcoldbrain noted that it is much safer if we do this comparison,
      // checking for both the string "null" and the actual null value.
      // @TODO: If core always returns null, this would cause a callstack exceeded error
      // Address this before releasing 3.x, if it is something to worry about.
      if (result === null || result === 'null') {
        console.warn(
          'Attached item does not exaist. Attempting to attach linked item...'
        );

        this._id = await this.getLinkedItem();

        if (this._id) {
          return this.getProperty(prop, param);
        } else {
          console.error('Failed to find linked item.');
        }
      } else {
        return typeof prop.getTransformer !== 'function'
          ? result
          : prop.getTransformer(result);
      }
    }

    throw new Error(`Params "${param}" validation failed`);
  }

  setConfiguration(config: object) {
    if (!this._isCurrentItem) {
      throw new Error('You can only set configuration for the current item');
    }

    if (!Environment.isSourcePlugin) {
      throw new Error('You can only set configuration in source plugins');
    }

    this._internal.exec(
      'SetBrowserProperty',
      'Configuration',
      JSON.stringify(config)
    );
  }

  async getConfiguration(): Promise<object | string> {
    if (!this._isCurrentItem) {
      throw new Error('You can only get configuration for the current item');
    }

    if (Environment.isExtension) {
      throw new Error('You cannot set configuration in extension plugins');
    }

    let result = await this._internal.exec(
      'GetLocalPropertyAsync',
      'prop:BrowserConfiguration'
    );

    if (!result || result === 'null') {
      result = await this._internal.exec('GetConfiguration');
    }

    return JSON.parse(result || '{}');
  }
}

export default Item;
