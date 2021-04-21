import { IInternal } from 'internal/types';
import Xjs from 'core/xjs';
import sprintf from 'helpers/sprintf';
import {
  IPropertyType,
  IKeyValuePair,
  PropertyParam,
  IAudioProperty,
  ISceneProperty,
  ISceneSceneProperty,
  ISceneViewProperty,
  ISceneSceneWidthHeightProperty,
  ISceneSceneParam,
  ISceneViewParam,
  ISceneSceneWidthHeightParam,
} from './types';

/**
 * The App class provides methods to get and set application-related functionalities
 *
 * @example
 *
 * ```ts
 * import Xjs from '@xjsframework/xjs';
 * import App from '@xjsframework/xjs/core/app';
 * import AppProps from '@xjsframework/xjs/props/app-props';
 *
 * const xjs = new Xjs();
 * const app = new App(xjs);
 *
 * app.getProperty(AppProps.sceneThumbnail, { scene: 1, width: 1280, height: 720 });
 * ```
 */
class App {
  private internal: IInternal;

  constructor(config: Xjs) {
    this.internal = config.internal;
  }

  setProperty(prop: IAudioProperty, param: string): Promise<string>;
  setProperty(prop: ISceneProperty, param: string): Promise<string>;
  setProperty(
    prop: ISceneSceneProperty,
    param: ISceneSceneParam
  ): Promise<string>;
  setProperty(
    prop: ISceneViewProperty,
    param: ISceneViewParam
  ): Promise<string>;
  setProperty(
    prop: ISceneSceneWidthHeightProperty,
    param: ISceneSceneWidthHeightParam
  ): Promise<string>;

  /**
   * Set application property
   *
   * @param prop Application Property object
   * @param param Params that would be passed to the underlying core function
   */
  setProperty(prop: IPropertyType, param: PropertyParam): Promise<string> {
    if (typeof prop.setValidator !== 'function' || prop.setValidator(param)) {
      let key = prop.key;
      let value: IKeyValuePair | string | number | boolean;

      if (typeof param === 'object') {
        const params = { ...param };
        key = sprintf(prop.key, params, true);
        value =
          typeof prop.setTransformer === 'function'
            ? prop.setTransformer(params)
            : String(params.value);
      } else {
        value =
          typeof prop.setTransformer === 'function'
            ? prop.setTransformer(param)
            : String(param);
      }

      return this.internal.exec('AppSetPropertyAsync', key, value);
    }

    throw new Error(`Params "${param}" validation failed`);
  }

  getProperty(prop: IAudioProperty): Promise<unknown>;
  getProperty(prop: ISceneProperty): Promise<unknown>;
  getProperty(
    prop: ISceneSceneProperty,
    param: ISceneSceneParam
  ): Promise<unknown>;
  getProperty(
    prop: ISceneViewProperty,
    param: ISceneViewParam
  ): Promise<unknown>;
  getProperty(
    prop: ISceneSceneWidthHeightProperty,
    param: ISceneSceneWidthHeightParam
  ): Promise<unknown>;

  /**
   * Get application property
   *
   * @param prop Application Property object
   * @param param Params that would be used to modify the property key
   */
  async getProperty(
    prop: IPropertyType,
    param?: IKeyValuePair
  ): Promise<unknown> {
    if (typeof prop.getValidator !== 'function' || prop.getValidator(param)) {
      const key = sprintf(prop.key, param || {});
      const ret = await this.internal.exec('AppGetPropertyAsync', key);

      return typeof prop.getTransformer === 'function'
        ? prop.getTransformer(ret)
        : ret;
    }

    throw new Error(`Params "${param}" validation failed`);
  }
}

export default App;
