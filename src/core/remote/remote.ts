import { v4 as uuid } from 'uuid';
import { CallbackType, ExecArgument, IInternal } from 'internal/types';
import { IMessenger, IRemoteConfig } from './types';
import { InvalidParamError } from 'internal/errors';
import cloneDeep from 'lodash-es/cloneDeep';

/**
 * This class is a drop-in replacement of the internal class. This will send the commands to a defined message transport
 * instead of passing it to XSplit
 */
export default class Remote implements IInternal {
  readonly remoteId: string = uuid();

  readonly messenger: IMessenger;

  private callbacks: Record<number, CallbackType> = {};

  private asyncId = 0;

  constructor(config: IRemoteConfig) {
    if (typeof config.messenger === 'undefined') {
      throw new InvalidParamError('`messenger` is required');
    }

    this.messenger = config.messenger;

    this.messenger.receive((message) => {
      if (message.type !== 'proxy') return;
      if (message.remoteId !== this.remoteId) return;
      if (typeof this.callbacks[message.asyncId] !== 'function') return;

      this.callbacks[message.asyncId](message.result);
    });
  }

  /**
   * Send external function call to server
   * @param  {string}          fn      function name
   * @param args
   * @return {Promise<string>}         function response
   */
  exec(fn: string, ...args: ExecArgument[]): Promise<string> {
    return new Promise((resolve, reject) => {
      this.asyncId++;
      this.messenger.send({
        type: 'remote',
        remoteId: this.remoteId,
        asyncId: this.asyncId,
        funcName: fn,
        args: args.map(String),
      });

      const timeout = setTimeout(() => {
        delete this.callbacks[this.asyncId];
        reject('Exec timeout. Execution exceeded 10 seconds.');
      }, 10000);

      this.callbacks[this.asyncId] = (res: string) => {
        clearTimeout(timeout);
        delete this.callbacks[this.asyncId];
        resolve(res);
      };
    });
  }

  execSync(fn: string, ...args: ExecArgument[]): Promise<string> {
    return new Promise((resolve, reject) => {
      this.asyncId++;
      this.messenger.send({
        type: 'remote',
        remoteId: this.remoteId,
        asyncId: this.asyncId,
        funcName: fn,
        args: args.map(String),
      });

      const timeout = setTimeout(() => {
        delete this.callbacks[this.asyncId];
        reject('Exec timeout. Execution exceeded 10 seconds.');
      }, 10000);

      this.callbacks[this.asyncId] = (res: string) => {
        clearTimeout(timeout);
        delete this.callbacks[this.asyncId];
        resolve(res);
      };
    });
  }

  execWithCallback(
    fn: string,
    callbackName: string,
    ...args: ExecArgument[]
  ): Promise<unknown> {
    return new Promise((resolve, reject) => {
      this.asyncId++;
      this.messenger.send({
        type: 'remote',
        remoteId: this.remoteId,
        asyncId: this.asyncId,
        funcName: fn,
        args: args.map(String),
        callbackName,
      });

      const timeout = setTimeout(() => {
        delete this.callbacks[this.asyncId];
        reject('Exec timeout. Execution exceeded 10 seconds.');
      }, 10000);

      this.callbacks[this.asyncId] = (res: string) => {
        clearTimeout(timeout);
        delete this.callbacks[this.asyncId];
        resolve(res);
      };
    });
  }

  /**
   * Send message to server, but do not handle its response
   * @param {string}         fn      function name
   * @param args
   */
  send(fn: string, ...args: (ExecArgument | CallbackType)[]): void {
    this.asyncId++;

    const payload = cloneDeep(args);

    const listener =
      typeof payload[payload.length - 1] === 'function' ? payload.pop() : null;

    if (typeof listener === 'function') {
      this.callbacks[this.asyncId] = listener;
    }

    this.messenger.send({
      type: 'remote',
      remoteId: this.remoteId,
      asyncId: -1,
      funcName: fn,
      args: payload.map(String),
    });
  }
}
