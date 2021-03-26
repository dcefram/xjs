import isFunction from 'lodash-es/isFunction';
import isNumber from 'lodash-es/isNumber';
import registerCallback from 'helpers/register-callback';
import {
  CallbackType,
  ExecArgument,
  IXSplitExternal,
  IInternal,
} from './types';

class Internal implements IInternal {
  private callbacks: Record<string, CallbackType> = {};

  private external: IXSplitExternal;

  constructor() {
    this.external = (window.external as unknown) as IXSplitExternal;

    registerCallback({
      OnAsyncCallback: (asyncId: string, ...responses: string[]) => {
        if (typeof this.callbacks[asyncId] === 'function') {
          const parsed = responses.map((response: string) =>
            decodeURIComponent(response)
          );
          this.callbacks[asyncId](...parsed);
          delete this.callbacks[asyncId];
        }
      },
    });
  }

  exec(fn: string, ...args: ExecArgument[]): Promise<string> {
    return new Promise((resolve, reject) => {
      if (
        !this.external ||
        typeof this.external.isXsplitShell === 'undefined'
      ) {
        resolve('');
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
        this.callbacks[ret] = (result) => {
          resolve(result as string);
        };
        return ret;
      }

      resolve(ret);
    });
  }

  execSync(fn: string, ...args: ExecArgument[]): string {
    if (!this.external || typeof this.external.isXsplitShell === 'undefined') {
      return '';
    }

    if (!window.external[fn] || !isFunction(window.external[fn])) {
      throw new Error(
        `${fn} is not a valid external call, or is not supported on the target environment.`
      );
    }

    return window.external[fn](...args);
  }

  execWithCallback(
    fn: string,
    callbackName: string,
    ...args: ExecArgument[]
  ): Promise<unknown> {
    return new Promise((resolve, reject) => {
      if (
        !this.external ||
        typeof this.external.isXsplitShell === 'undefined'
      ) {
        resolve('');
      }

      if (!window.external[fn] || !isFunction(window.external[fn])) {
        reject(
          new Error(
            `${fn} is not a valid external call, or is not supported on the target environment.`
          )
        );
        return;
      }

      registerCallback(
        {
          [callbackName]: (...params) => {
            resolve(params);
          },
        },
        { cleanup: true }
      );

      window.external[fn](...args);
    });
  }
}

export default Internal;
