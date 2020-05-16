import App from '../app';
import View from '../view';
import Scene from '../Scene';
import Environment from '../../helpers/environment';
import Item from '../item';
import Remote from '../remote';
import Internal from '../../internal';
import Environment from '../../helpers/environment';
import { XjsTypes, XjsEnvironments, LogVerbosity, Config } from './types';

export default class Xjs {
  static version = '%XJS_VERSION%';

  private type: XjsTypes = XjsTypes.Local;

  private version: string;

  private internal: Internal;

  App: App;

  View: View;

  Scene: Scene;

  Item: Item;

  remote: Remote;

  constructor(config: Config = { type: XjsTypes.Local }) {
    Object.keys(config).forEach((key: string) => {
      if (this.hasOwnProperty(key)) {
        this[key] = config[key];
      }
    });

    // Initialize the internal methods and the view
    this.internal = new Internal(this.type);

    this.App = new App({ internal: this.internal });

    this.View = new View({ internal: this.internal });

    this.Scene = new Scene({ internal: this.internal });

    this.Item = new Item({ internal: this.internal });

    // @ts-ignore
    if ([XjsTypes.Remote, XjsTypes.Proxy].includes(this.type)) {
      this.remote = new Remote({
        type: this.type,
        exec: this.exec,
      });

      this.remote.setSender(config.sendMessage);
      this.internal.setRemote(this.remote);
    }
  }

  async setConfigWindow(url: string) {
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
