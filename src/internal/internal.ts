import isFunction from 'lodash-es/isFunction';
import isNumber from 'lodash-es/isNumber';
import { XjsTypes } from 'core/xjs/types';
import Remote from 'core/remote';
import registerCallback from 'helpers/register-callback';
import { ExecArgument, IKeyValuePair, IXSplitExternal } from './types';

class Internal {
  private _callbacks: IKeyValuePair = {};

  private type: XjsTypes;
  private remote: Remote;
  private external: IXSplitExternal;

  constructor(type: XjsTypes) {
    this.external = (window.external as unknown) as IXSplitExternal;
    this.type = type;

    registerCallback({
      OnAsyncCallback: (asyncId: string, ...responses: string[]) => {
        if (typeof this._callbacks[asyncId] === 'function') {
          const parsed = responses.map((response: string) =>
            decodeURIComponent(response)
          );
          this._callbacks[asyncId](...parsed);
          delete this._callbacks[asyncId];
        }
      },
    });
  }

  setRemote(remote: Remote): void {
    this.remote = remote;
  }

  exec(fn: string, ...args: ExecArgument[]): Promise<string> {
    return new Promise((resolve, reject) => {
      if (this.isRemote()) {
        return this.remote
          .send({
            from: XjsTypes.Remote,
            clientId: this.remote.clientId,
            fn,
            args,
          })
          .then(resolve)
          .catch(reject);
      }

      if (!this.external || typeof this.external.isXsplitShell === 'undefined') {
        resolve();
      }

      if (!window.external[fn] || !isFunction(window.external[fn])) {
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
          resolve(result as string);
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
