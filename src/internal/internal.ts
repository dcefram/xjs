interface CallbackType {
  [asyncId: string]: any;
}

export const _callbacks = {};

class Internal {
  //private _callbacks: CallbackType = {};

  constructor() {
    const existingAsyncCallback = window.OnAsyncCallback;
    window.OnAsyncCallback = (asyncId: string, result: string) => {
      if (typeof _callbacks[asyncId] === 'function') {
        _callbacks[asyncId](decodeURIComponent(result));
        delete _callbacks[asyncId];
      }

      if (typeof existingAsyncCallback === 'function') {
        existingAsyncCallback(asyncId, result);
      }
    };
  }

  exec(fn: string, ...args: any[]): Promise<any> {
    return new Promise((resolve, reject) => {
      // @TODO: Add condition for remote thingy
      if (
        !window.external ||
        !window.external[fn] ||
        typeof window.external[fn] !== 'function'
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
        _callbacks[ret] = result => {          
          resolve(result);
        };        
        return ret;
      }

      resolve(ret);
    });
  }
}

export default Internal;
