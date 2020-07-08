import { XjsTypes, XjsEnvironments, LogVerbosity, Config } from './types';
import Internal from '../../internal';
import App from '../app';
import View from '../view';
import Environment from '../../helpers/environment';
import Item from '../item';

export default class Xjs {
  static version = '%XJS_VERSION%';

  private type: XjsTypes;

  private environment: XjsEnvironments;

  private logVerbosity: LogVerbosity;

  private version: string;

  private sendMessage: any;

  private onMessageReceive: any;

  private logger: any;

  private exec: any;

  app: App;

  _internal: Internal;

  constructor(config: Config = { type: XjsTypes.Local }) {
    Object.keys(config).forEach((key: string) => {
      if (this.hasOwnProperty(key)) {
        this[key] = config[key];
      }
    });

    // Initialize the internal methods and the view
    this._internal = new Internal();

    this.exec = this._internal.exec.bind(this._internal);

    this.app = new App({ internal: this._internal });
  }

  getView(index: number) {
    return new View({
      app: this.app,
      internal: this._internal,
      index,
    });
  }

  async setConfigWindow(url: string) {
    if (!Environment.isSourcePlugin) {
      throw new Error('can only set configuration for the current item');
    }

    let browserConfig: string = await this.exec(
      'GetLocalPropertyAsync',
      'prop:BrowserConfiguration'
    );
    let configObj: any = {};

    if (browserConfig === '' || browserConfig === 'null') {
      browserConfig = await this.exec('GetConfiguration');
    }

    configObj = JSON.parse(browserConfig || '{}');

    configObj.configUrl = url;

    await this.exec(
      'SetBrowserProperty',
      'Configuration',
      JSON.stringify(configObj)
    );

    // @TODO: Return an instance of the config window??
    return true;
  }

  async getCurrentItem() {
    if (Environment.isExtension) {
      throw new Error('You cannot use `getCurrentItem` in an extension plugin');
    }

    const itemsString = await this.exec('GetLocalPropertyAsync', 'itemlist');
    const srcId = await this.exec('GetLocalPropertyAsync', 'prop:srcid');
    const items = itemsString.split(',');

    if (items.length === 0) {
      throw new Error(
        'Cannot get current item, itemlist did not return any ID'
      );
    }

    return new Item({
      internal: this._internal,
      id: items[0],
      srcId,
      isCurrentItem: true,
    });
  }
}
