import Internal from 'internal';
import Xjs from 'core/xjs';
import { SceneId, SceneIndex } from 'core/scene/types';
import { PresetId } from './types';

/**
 * The Preset class provides methods to handle scene presets
 *
 * @example
 *
 * ```ts
 * import Xjs from '@xjsframework/xjs';
 * import Preset from '@xjsframework/core/preset';
 *
 * const xjs = new Xjs();
 * const preset = new Preset(xjs);
 *
 * const scenePresets = await preset.listAll(0);
 * ```
 */
class Preset {
  private internal: Internal;

  constructor({ internal }: Xjs) {
    this.internal = internal;
  }

  async listAll(scene: SceneId | SceneIndex): Promise<PresetId[]> {
    const presetsString = await this.internal.exec(
      'AppGetPropertyAsync',
      `scenepresetlist:${scene}`
    );

    const presets = presetsString.split(',').filter(Boolean);

    return ['{00000000-0000-0000-0000-000000000000}', ...presets];
  }

  async getActive(scene: SceneId | SceneIndex): Promise<PresetId> {
    return await this.internal.exec('AppGetProperty', `scenepreset:${scene}`);
  }

  async setActive(
    scene: SceneId | SceneIndex,
    presetId: PresetId
  ): Promise<boolean> {
    await this.internal.exec(
      'AppSetPropertyAsync',
      `scenepreset:${scene}`,
      presetId
    );
    return true;
  }
}

export default Preset;
