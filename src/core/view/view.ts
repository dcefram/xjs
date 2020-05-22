import Internal from '../../internal';
import App from '../app';

import { ViewConfig, ViewIndex } from './types';
import { SceneIndex } from '../scene/types';

class View {
  private internal: Internal;

  constructor(config: ViewConfig) {
    this.internal = config.internal;
  }

  async getCurrentSceneIndex(index: ViewIndex): Promise<SceneIndex> {
    const sceneIndex = await this.internal.exec(
      'AppGetPropertyAsync',
      `scene:${index}`
    );

    const id = await this.internal.exec(
      'AppGetPropertyAsync',
      `scene:${sceneIndex}`
    );

    return Number(id);
  }

  async isSplitMode() {
    return Boolean(
      Number(await this.internal.exec('GetGlobalProperty', 'splitmode'))
    );
  }
}

export default View;
