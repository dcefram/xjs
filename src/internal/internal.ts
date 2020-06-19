import isFunction from 'lodash/isFunction';
import isNumber from 'lodash/isNumber';
import { XjsTypes } from 'core/xjs/types';
import Remote from 'core/remote';

interface CallbackType {
  [asyncId: string]: any;
}

class Internal {
  private _callbacks: CallbackType = {};

  private type: XjsTypes;
  private remote: Remote;

  constructor(type) {
    this.type = type;

    const existingAsyncCallback = window.OnAsyncCallback;
    window.OnAsyncCallback = (asyncId: string, result: string) => {
      if (typeof this._callbacks[asyncId] === 'function') {
        this._callbacks[asyncId](decodeURIComponent(result));
        delete this._callbacks[asyncId];
      }

      if (typeof existingAsyncCallback === 'function') {
        existingAsyncCallback(asyncId, result);
      }
    };
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
        this._callbacks[ret] = result => {
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
