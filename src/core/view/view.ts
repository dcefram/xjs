import { IInternal } from 'internal/types';
import Xjs from 'core/xjs';
import { SceneIndex } from 'core/scene/types';

import { ViewIndex } from './types';

class View {
  private internal: IInternal;

  constructor(config: Xjs) {
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

  async isSplitMode(): Promise<boolean> {
    return Boolean(
      Number(await this.internal.exec('GetGlobalProperty', 'splitmode'))
    );
  }
}

export default View;
