import parser from 'fast-xml-parser';

import Xjs from '../xjs';
import Internal from '../../internal';
import Item from '../item';
import App from '../app';

import { SceneConfig, SceneInfo, Placement } from './types';

class Scene {
  private internal: Internal;

  constructor(config: SceneConfig) {
    this.internal = config.internal;
  }

  async getByIndex(index: number): Promise<SceneInfo> {
    const arrayOfScenes = await this.listAll();

    return (
      arrayOfScenes.find(scene => scene.index === index) ||
      Promise.reject(`Scene index: ${index} not found`)
    );
  }

  async getById(id: string): Promise<SceneInfo> {
    const arrayOfScenes = await this.listAll();

    return (
      arrayOfScenes.find(scene => scene.id === id) ||
      Promise.reject(`Scene with id: ${id} not found`)
    );
  }

  async setActive(indexOrId: number | number) {
    const splitMode = Boolean(
      Number(await this.internal.exec('GetGlobalProperty', 'splitmode'))
    );

    const mode = splitMode ? 'scene:1' : 'scene:0';

    return await this.internal.exec(mode, indexOrId);
  }

  async listAll() {
    const xmlString = await this.internal.exec(
      'AppGetPropertyAsync',
      'sceneconfig'
    );
    const result = parser.parse(xmlString, {
      attributeNamePrefix: '',
      ignoreAttributes: false,
    });

    const {
      configuration: { placement },
    } = result;

    if (Array.isArray(placement)) {
      // We get all ids
      return placement.map((item: Placement, index: number) => {
        return { id: item.id, index, name: item.name };
      });
    } else if (typeof placement === 'object') {
      return [{ id: placement.id, index: 0, name: placement.name }];
    }

    return [];
  }

  async getItems(id: string): Promise<Item[]> {
    const xmlString = await this.internal.exec(
      'AppGetPropertyAsync',
      `sceneconfig:${id}`
    );

    const sceneObject = parser.parse(xmlString, {
      attributeNamePrefix: '',
      ignoreAttributes: false,
    });
    const items = Array.isArray(sceneObject.placement.item)
      ? sceneObject.placement.item
      : [sceneObject.placement.item];

    return items.map(({ id, srcid }: any) => ({ id, srcid }));
  }
}

export default Scene;
