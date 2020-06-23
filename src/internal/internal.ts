import isFunction from 'lodash/isFunction';
import isNumber from 'lodash/isNumber';
import { XjsTypes } from 'core/xjs/types';
import Remote from 'core/remote';
import registerCallback from 'helpers/register-callback';

interface CallbackType {
  [asyncId: string]: any;
}

class Internal {
  private _callbacks: CallbackType = {};

  private type: XjsTypes;
  private remote: Remote;

  constructor(type) {
    this.type = type;

    registerCallback({
      OnAsyncCallback:  (asyncId: string, ...responses: string[]) => {
        if (typeof this._callbacks[asyncId] === 'function') {
          const parsed = responses.map((response: string) => decodeURIComponent(response));
          this._callbacks[asyncId](...parsed);
          delete this._callbacks[asyncId];
        }
      }
    });
  }

  setRemote(remote) {
    this.remote = remote;
  }

  exec(fn: string, ...args: any[]): Promise<any> {
    return new Promise((resolve, reject) => {
      if (this.isRemote()) {
        return this.remote
          .send({
            fn,
            args,
          })
          .then(resolve)
          .catch(reject);
      }

      // @TODO: Add condition for remote thingy
      if (
        !window.external ||
        !window.external[fn] ||
        !isFunction(window.external[fn])
      ) {
        reject(
          new Error(
            `${fn} is not a valid external call, or is not supported on the target environment.`
          )
        );
        return;
      }

      const ret = window.external[fn](...args);

      if (isNumber(ret)) {
        this._callbacks[ret] = (result) => {
          resolve(result);
        };
        return ret;
      }

      resolve(ret);
    });
  }

  private isRemote() {
    return this.type === XjsTypes.Remote;
  }
}

export default Internal;
