import Environment from 'helpers/environment';
import { Remote, Proxy } from 'core/remote';
import Internal from 'internal';
import { IInternal } from 'internal/types';
import { IConfig, IKeyValuePair, XjsTypes } from './types';

export default class Xjs {
  static version = '%XJS_VERSION%';

  private type: XjsTypes = XjsTypes.Local;

  private version: string;

  private event: Event;

  internal: IInternal;

  constructor(config: IConfig = { type: XjsTypes.Local }) {
    Object.keys(config).forEach((key: string) => {
      if (this.hasOwnProperty(key)) {
        this[key] = config[key];
      }
    });

    switch (this.type) {
      case XjsTypes.Remote:
        this.internal = new Remote({ messenger: config.messenger });
        break;

      case XjsTypes.Proxy:
        this.internal = new Proxy({ messenger: config.messenger });
        break;

      default:
        this.internal = new Internal();
    }
  }

  /**
   * Set a custom source property window
   *
   * @param url Path or address that would be rendered inside the source property window
   */
  async setConfigWindow(url: string): Promise<boolean> {
    if (!Environment.isSourcePlugin) {
      throw new Error('can only set configuration for the current item');
    }

    let browserConfig: string = await this.internal.exec(
      'GetLocalPropertyAsync',
      'prop:BrowserConfiguration'
    );
    let configObj: IKeyValuePair = {};

    if (browserConfig === '' || browserConfig === 'null') {
      browserConfig = await this.internal.exec('GetConfiguration');
    }

    configObj = JSON.parse(browserConfig || '{}');

    configObj.configUrl = url;

    await this.internal.exec(
      'SetBrowserProperty',
      'Configuration',
      JSON.stringify(configObj)
    );

    // @TODO: Return an instance of the config window??
    return true;
  }

  isLocal(): boolean {
    return this.type === XjsTypes.Local;
  }

  isProxy(): boolean {
    return this.type === XjsTypes.Proxy;
  }

  isRemote(): boolean {
    return this.type === XjsTypes.Remote;
  }
}
