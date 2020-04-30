import parser from 'fast-xml-parser';

import Xjs from '../xjs';
import Internal from '../../internal';
import Item from '../item';
import App from '../app';
import AppProps from '../../props/app-props';

import { SceneConfig } from './types';

class Scene {
  private _app: App;
  private _internal: Internal;
  private _index: number;
  private _uid: string;
  private _items: Item[];

  static fromXMLString(xmlString: string, xjs: Xjs) {
    const sceneObject = parser.parse(xmlString, {
      attributeNamePrefix: '',
      ignoreAttributes: false,
    });

    // Check if valid XML... we consider it valid if it has an id :D
    if (
      sceneObject &&
      sceneObject.placement &&
      typeof sceneObject.placement.id !== 'undefined'
    ) {
      return new Scene({
        app: xjs.app,
        internal: xjs._internal,
        uid: sceneObject.placement.id,
      });
    }

    throw new Error('Invalid XML passed to `fromXMLString`');
  }

  constructor(config: SceneConfig) {
    this._app = config.app;
    this._internal = config.internal;
    this._index = config.index;
    this._uid = config.uid;
  }

  async getItems(useCache = true): Promise<Item[]> {
    if (useCache && this._items instanceof Array && this._items.length > 0) {
      return this._items;
    }

    const xmlString = await this._app.getProperty(AppProps.sceneItems, {
      scene: this._uid || this._index,
    });

    const sceneObject = parser.parse(xmlString, {
      attributeNamePrefix: '',
      ignoreAttributes: false,
    });
    const items =
      sceneObject.placement.item instanceof Array
        ? sceneObject.placement.item
        : [sceneObject.placement.item];

    if (!this._uid) {
      this._uid = sceneObject.placement.id;
    }

    this._items = items.map(
      item =>
        new Item({ internal: this._internal, id: item.id, srcId: item.srcid })
    );

    return this._items;
  }

  async getPresets(): Promise<string[]> {
    const firstPreset = '{00000000-0000-0000-0000-000000000000}';
    const presets = await this._app.getProperty(AppProps.scenePresetList, {
      scene: this._uid,
    });

    return ['{00000000-0000-0000-0000-000000000000}', ...presets];
  }

  async getActivePreset(): Promise<string> {
    const presetUid = await this._app.getProperty(AppProps.scenePreset, {
      scene: this._uid,
    });

    return presetUid;
  }

  async switchToPreset(presetUid: string): Promise<boolean> {
    const result = await this._app.setProperty(AppProps.scenePreset, {
      scene: this._uid
    });

    return result;
  }

  async addPreset(): Promise<string> {
    const result = await this._app.getProperty(AppProps.sceneNewPreset, {
      scene: this._uid
    });

    return result;
  }

  async removePreset(presetId: string): Promise<boolean> {
    const result = await this._app.setProperty(AppProps.sceneRemovePreset, {
      scene: this._uid,
      value: presetId,
    });

    return result;
  }

  async getPresetTransition(): Promise<string> {
    const result = await this._app.getProperty(AppProps.scenePresetTransition, {
      scene: this._uid,
    })

    return result;
  }

  async setPresetTransition(transition: string): Promise<boolean> {
    const result = await this._app.setProperty(AppProps.scenePresetTransition, {
      scene: this._uid,
      value: transition,
    });

    return result;
  }

  async getPresetTransitionTime(): Promise<number> {
    const result = await this._app.getProperty(AppProps.scenePresetTransitionTime, {
      scene: this._uid,
    });

    return result;
  }

  async setPresetTransitionTime(time: number): Promise<boolean> {
    const result = await this._app.setProperty(AppProps.scenePresetTransitionTime, {
      scene: this._uid,
      value: time,
    });

    return result;
  }
}

export default Scene;
