import Internal from '../../internal';
import App from '../app';

import { ViewConfig } from './types';
import { SceneInfo } from '../scene/types';

class View {
  private internal: Internal;

  constructor(config: ViewConfig) {
    this.internal = config.internal;
  }

  async getCurrentScene(index: number): Promise<SceneInfo> {
    const sceneIndex = await this.internal.exec(
      'AppGetPropertyAsync',
      `scene:${index}`
    );

    const id = await this.internal.exec(
      'AppGetPropertyAsync',
      `scene:${sceneIndex}`
    );

    return { index: sceneIndex, id };
  }

  async isSplitMode() {
    return Boolean(
      Number(await this.internal.exec('GetGlobalProperty', 'splitmode'))
    );
  }
}

export default View;
