import parser from 'fast-xml-parser';

import Internal from '../../internal';
import Environment from '../../helpers/environment';
import Xjs from '../xjs';

import { ItemConfig, PropertyType } from './types';

class Item {
  private _internal: Internal;
  private _attributes: any;
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
        attributes: itemObject.item,
      });
    }

    throw new Error('Invalid XML passed to `fromXMLString`');
  }

  constructor(config: ItemConfig) {
    this._internal = config.internal;
    this._attributes = config.attributes;
    this._isCurrentItem = !!config.isCurrentItem;
  }

  setProperty(prop: PropertyType, param: any): Promise<any> {
    if (prop.setValidator(param)) {
      if (!Environment.isSourcePlugin) {
        this._internal.exec('SearchVideoItem', this._attributes.id);
      }
      return this._internal.exec(
        'SetLocalPropertyAsync',
        prop.key,
        prop.setTransformer(param)
      );
    }

    throw new Error(`Params "${param}" validation failed`);
  }

  async getProperty(prop: PropertyType, param: any): Promise<any> {
    if (prop.getValidator(param)) {
      if (!Environment.isSourcePlugin) {
        this._internal.exec('SearchVideoItem', this._attributes.id);
      }
      const ret = await this._internal.exec('GetLocalPropertyAsync', prop.key);
      return prop.getTransformer(ret);
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

    const config = JSON.parse(result || '{}');

    return config;
  }
}

export default Item;
