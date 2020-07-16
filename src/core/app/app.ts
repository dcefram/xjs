import Internal from 'internal';
import Xjs from 'core/xjs';
import sprintf from 'helpers/sprintf';
import { IPropertyType, IKeyValuePair, PropertyParam } from './types';

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
  private internal: Internal;

  constructor(config: Xjs) {
    this.internal = config.internal;
  }

  /**
   * Set application property
   *
   * @param prop Application Property object
   * @param param Params that would be passed to the underlying core function
   */
  setProperty(prop: IPropertyType, param: PropertyParam): Promise<string> {
    if (typeof prop.setValidator !== 'function' || prop.setValidator(param)) {
      let key = prop.key;
      let value = param;
      if (typeof param === 'object') {
        const params = { ...param };
        key = sprintf(prop.key, params, true);
        value = params;
      }
      const params = typeof param === 'object' ? { ...param } : param; // clone object
      value =
        typeof prop.setTransformer === 'function'
          ? prop.setTransformer(params)
          : params;

      return this.internal.exec('AppSetPropertyAsync', key, value);
    }

    throw new Error(`Params "${param}" validation failed`);
  }

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
