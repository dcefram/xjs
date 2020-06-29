import Environment from 'helpers/environment';
import Remote from 'core/remote';
import Internal from 'internal';
import { XjsTypes, Config } from './types';

/**
 * An xjs instance holds the necessary details to
 * know which context to run the underlying core
 * methods.
 *
 * By default, creating an Xjs instance would assume
 * that it would execute the local XSplit broadcaster's
 * core methods unless the `type` is specified when
 * creating the instance.
 *
 * Example:
 * ```
 * import Xjs, { XjsTypes } from '@dcefram/xjs';
 *
 * const localXjs = new Xjs();
 * const remoteXjs = new Xjs({ type: XjsTypes.Remote, sendMessage });
 * const proxyXjs = new Xjs({ type: XjsTypes.Proxy, sendMessage });
 * ```
 *
 * Multiple Xjs instances are allowed to run side-by-side
 */
export default class Xjs {
  static version = '%XJS_VERSION%';

  private type: XjsTypes = XjsTypes.Local;

  private version: string;

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

    if ([XjsTypes.Remote, XjsTypes.Proxy].includes(this.type)) {
      this.remote = new Remote({
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
}
