import parser from 'fast-xml-parser';

import Internal from 'internal';

import isSplitMode from 'helpers/is-split-mode';

import { SceneInfo, Placement, SceneId, SceneIndex, Item } from './types';
import unescape from 'lodash/unescape';

class Scene {
  private internal: Internal;

  constructor({ internal }) {
    this.internal = internal;
  }

  async getByIndex(index: SceneIndex): Promise<SceneInfo> {
    const xmlString = await this.internal.exec(
      'AppGetPropertyAsync',
      `sceneconfig:${index}`
    );
    const result = parser.parse(xmlString, {
      attributeNamePrefix: '',
      ignoreAttributes: false,
    });
    const { placement } = result;

    return { index, id: placement.id, name: placement.name };
  }

  async getById(id: SceneId): Promise<SceneInfo> {
    const arrayOfScenes = await this.listAll();

    return (
      arrayOfScenes.find((scene) => scene.id === id) ||
      Promise.reject(`Scene with id: ${id} not found`)
    );
  }

  async getActive(): Promise<SceneInfo> {
    const splitMode = await isSplitMode(this.internal);

    if (splitMode) {
      const id = decodeURIComponent(
        await this.internal.exec('AppGetPropertyAsync', 'sceneid:i12')
      );

      return this.getById(id);
    }

    const index = Number(
      await this.internal.exec('AppGetPropertyAsync', 'scene:0')
    );

    return this.getByIndex(index);
  }

  async setActive(indexOrId: SceneId | SceneIndex): Promise<Boolean> {
    const splitMode = await isSplitMode(this.internal);

    if (splitMode) {
      await this.internal.exec(
        'AppSetPropertyAsync',
        'scene:1',
        String(indexOrId)
      );

      await this.internal.exec('CallHostFunc', 'goLive');
      return true;
    }

    await this.internal.exec(
      'AppSetPropertyAsync',
      'scene:0',
      String(indexOrId)
    );
    return true;
  }

  async setName(id: SceneId, name: string): Promise<Boolean> {
    await this.internal.exec('AppSetPropertyAsync', `scenename:${id}`, name);
    return true;
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

  async getItems(id: SceneId): Promise<Item[]> {
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

    return items.map(({ id, srcid, name }: any) => ({
      id,
      srcid,
      name: unescape(name),
    }));
  }
}

export default Scene;
