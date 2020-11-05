import { v4 as uuid } from 'uuid';
import { CallbackType, ExecArgument } from 'internal/types';
import { IMessenger, IRemoteConfig } from './types';
import { InvalidParamError } from 'internal/errors';

/**
 * This class is a drop-in replacement of the internal class. This will send the commands to a defined message transport
 * instead of passing it to XSplit
 */
export default class Remote {
  readonly remoteId: string = uuid();

  readonly messenger: IMessenger;

  private callbacks: Record<number, CallbackType>;

  private asyncId: number;

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
        reject('Exec timeout. Execution exceeded 10 seconds.');
        delete this.callbacks[this.asyncId];
      }, 10000);

      this.callbacks[this.asyncId] = (res: string) => {
        clearTimeout(timeout);
        delete this.callbacks[this.asyncId];
        resolve(res);
      };
    });
  }
}
