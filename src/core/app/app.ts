import Internal from 'internal';
import Xjs from 'core/xjs';
import sprintf from 'helpers/sprintf';
import { IPropertyType, IKeyValuePair } from './types';

class App {
  private internal: Internal;

  constructor(config: Xjs) {
    this.internal = config.internal;
  }

  setProperty(prop: IPropertyType, param: IKeyValuePair): Promise<string> {
    if (typeof prop.setValidator !== 'function' || prop.setValidator(param)) {
      const params = { ...param };
      const key = sprintf(prop.key, params, true);
      const value =
        typeof prop.setTransformer === 'function'
          ? prop.setTransformer(params)
          : params;

      return this.internal.exec('AppSetPropertyAsync', key, value);
    }

    throw new Error(`Params "${param}" validation failed`);
  }

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
