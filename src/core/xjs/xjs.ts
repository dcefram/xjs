import { v4 as uuid } from 'uuid';
import Environment from 'helpers/environment';
import Remote from 'core/remote';
import Internal from 'internal';
import { XjsTypes, Config } from './types';

export default class Xjs {
  static version = '%XJS_VERSION%';

  private type: XjsTypes = XjsTypes.Local;

  private version: string;

  private event: Event;

  clientId = uuid();

  internal: Internal;

  remote: Remote;

  constructor(config: Config = { type: XjsTypes.Local }) {
    Object.keys(config).forEach((key: string) => {
      if (this.hasOwnProperty(key)) {
        this[key] = config[key];
      }
    });

    // Initialize the internal methods and the view
    this.internal = new Internal(this.type);

    // @ts-ignore
    if ([XjsTypes.Remote, XjsTypes.Proxy].includes(this.type)) {
      this.remote = new Remote({
        clientId: this.clientId,
        type: this.type,
        exec: this.internal.exec.bind(this.internal),
      });

      this.remote.setSender(config.sendMessage);
      this.internal.setRemote(this.remote);
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
    let configObj: any = {};

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

  isLocal() {
    return this.type === XjsTypes.Local;
  }

  isProxy() {
    return this.type === XjsTypes.Proxy;
  }

  isRemote() {
    return this.type === XjsTypes.Remote;
  }
}
