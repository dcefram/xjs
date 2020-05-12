import Xjs from 'core/xjs';
import { isFunction } from 'helpers';

interface CallbackType {
  [asyncId: string]: any;
}

class Internal {
  private _callbacks: CallbackType = {};

  private xjs: Xjs;

  constructor(xjs) {
    this.xjs = xjs;

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

  exec(fn: string, ...args: any[]): Promise<any> {
    return new Promise((resolve, reject) => {
      if (this.xjs.isRemote()) {
        return this.xjs.remote.send({
          fn,
          args,
        });
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

      if (typeof ret === 'number') {
        this._callbacks[ret] = result => {
          resolve(result);
        };
        return ret;
      }

      resolve(ret);
    });
  }
}

export default Internal;
