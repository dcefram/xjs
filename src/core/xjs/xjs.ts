import { v5 as uuidv5 } from 'uuid';

import App from '../app';
import Environment from '../../helpers/environment';
import Item from '../item';
import Remote from '../remote';
import Internal from '../../internal';
import Event from '../events';
import { XjsTypes, Config } from './types';

export default class Xjs {
  static version = '%XJS_VERSION%';

  private type: XjsTypes = XjsTypes.Local;

  private version: string;

  private event: Event;

  clientId = uuidv5('xjsframework.github.io', uuidv5.DNS);

  internal: Internal;

  App: App;

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

    // initialize Event

    // @ts-ignore
    if ([XjsTypes.Proxy, XjsTypes.Local].includes(this.type)) {
      this.event = new Event({
        type: this.type,
        remote: this.remote,
      });
      //
      // emit(eventName, result) {
      //   callbacks.hasOwnProperty(eventName) && callbacks[eventName](result)
      //   if (this.type === XjsTypes.Proxy) {
      //     this.remote.triggerEvent(eventName, result)
      //   }
      // }
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

  on(eventName, callback) {
    // CLIENT
    // send to proxy with xjs

    if (this.type === XjsTypes.Remote) {
      this.remote.client.registerEvent(eventName, callback);
      return;
    }

    if (this.type === XjsTypes.Local) {
      this.event.subscribe(eventName, callback);
    }
  }
}
