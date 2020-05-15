import Internal from '../../internal';
import sprintf from '../../helpers/sprintf';

import { AppConfig, PropertyType } from './types';

class App {
  private _internal: Internal;

  constructor(config: AppConfig) {
    this._internal = config.internal;
  }

  setProperty(prop: PropertyType, param: any): Promise<any> {
    if (typeof prop.setValidator !== 'function' || prop.setValidator(param)) {
      const params = { ...param };
      const key = sprintf(prop.key, params, true);
      const value =
        typeof prop.setTransformer === 'function'
          ? prop.setTransformer(params)
          : params;

      return this._internal.exec('AppSetPropertyAsync', key, value);
    }

    throw new Error(`Params "${param}" validation failed`);
  }

  async getProperty(prop: PropertyType, param?: any): Promise<any> {
    if (typeof prop.getValidator !== 'function' || prop.getValidator(param)) {
      const key = sprintf(prop.key, param || {});
      const ret = await this._internal.exec('AppGetPropertyAsync', key);

      return typeof prop.getTransformer === 'function'
        ? prop.getTransformer(ret)
        : ret;
    }

    throw new Error(`Params "${param}" validation failed`);
  }
}

export default App;
