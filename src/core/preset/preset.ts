import Internal from 'internal';
import { SceneId } from 'core/scene/types';
import { PresetId } from './types';

class Preset {
  private internal: Internal;

  constructor({ internal }) {
    this.internal = internal;
  }

  async listAll(id: SceneId): Promise<PresetId[]> {
    const presetsString = await this.internal.exec(
      'AppGetPropertyAsync',
      `scenepresetlist:${id}`
    );

    const presets = presetsString.split(',').filter(Boolean);

    return ['{00000000-0000-0000-0000-000000000000}', ...presets];
  }

  async getActive(id: SceneId): Promise<PresetId> {
    return await this.internal.exec('AppGetProperty', `scenepreset:${id}`);
  }

  async setActive(id: SceneId, presetId: PresetId): Promise<Boolean> {
    await this.internal.exec(
      'AppSetPropertyAsync',
      `scenepreset:${id}`,
      presetId
    );
    return true;
  }
}

export default Preset;
