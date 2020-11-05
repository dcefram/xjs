import { v4 as uuid } from 'uuid';
import { InvalidParamError } from 'internal/errors';
import Internal from 'internal';
import { CallbackType } from 'internal/types';
import { IMessenger, IRemoteConfig, IRemoteMessage } from './types';

/**
 * This class is a drop-in replacement of the internal class. This will send the commands to a defined message transport
 * instead of passing it to XSplit
 */
export default class Remote {
  readonly proxyId: string = uuid();

  readonly messenger: IMessenger;

  readonly internal: Internal;

  private callbacks: Record<number, CallbackType>;

  private asyncId: number;

  constructor(config: IRemoteConfig) {
    if (typeof config.messenger === 'undefined') {
      throw new InvalidParamError('`messenger` is required');
    }

    this.internal = new Internal();
    this.messenger = config.messenger;

    this.messenger.receive(this.handleMessage);
  }

  exec(): void {
    throw new Error(
      'Illegal operation. XJS Proxy only executes commands from connected remotes'
    );
  }

  async handleMessage(message: IRemoteMessage): Promise<void> {
    if (message.type !== 'remote') return;

    const result = await this.internal.exec(message.funcName, ...message.args);
    this.messenger.send({
      type: 'proxy',
      proxyId: this.proxyId,
      remoteId: message.remoteId,
      asyncId: message.asyncId,
      result,
    });
  }
}
