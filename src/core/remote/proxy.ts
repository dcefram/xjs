import { v4 as uuid } from 'uuid';
import { InvalidParamError } from 'internal/errors';
import Internal from 'internal';
import { IInternal } from 'internal/types';
import * as SupportedTransforms from 'core/events/transforms-list';
import Events from 'core/events';
import { IMessenger, IRemoteConfig, IRemoteMessage } from './types';

/**
 * This class is a drop-in replacement of the internal class. This will send the commands to a defined message transport
 * instead of passing it to XSplit
 */
export default class Proxy implements IInternal {
  readonly proxyId: string = uuid();

  readonly messenger: IMessenger;

  readonly internal: Internal;

  private eventsLoadedInstances: string[] = [];

  private eventsInstance: Events;

  constructor(config: IRemoteConfig) {
    if (typeof config.messenger === 'undefined') {
      throw new InvalidParamError('`messenger` is required');
    }

    this.internal = new Internal();
    this.messenger = config.messenger;

    this.messenger.receive(this.handleMessage.bind(this));
  }

  exec(): Promise<string> {
    throw new Error(
      'Illegal operation. XJS Proxy only executes commands from connected remotes'
    );
  }

  private async handleMessage(message: IRemoteMessage): Promise<void> {
    if (message.type !== 'remote') return;

    if (message.funcName === 'register-event') {
      this.handleRegisterEventListener(message);
      return;
    }

    if (
      message.funcName === 'listen-event' &&
      this.eventsInstance instanceof Events
    ) {
      message.args.forEach((eventName) => {
        this.eventsInstance.on(eventName, (...values: unknown[]) => {
          this.messenger.send({
            type: 'proxy',
            proxyId: this.proxyId,
            remoteId: message.remoteId,
            asyncId: message.asyncId,
            result: JSON.stringify({
              event: eventName,
              data: values,
            }),
          });
        });
      });
      return;
    }

    const result = await this.internal.exec(message.funcName, ...message.args);
    this.messenger.send({
      type: 'proxy',
      proxyId: this.proxyId,
      remoteId: message.remoteId,
      asyncId: message.asyncId,
      result,
    });
  }

  private handleRegisterEventListener(message: IRemoteMessage) {
    const loadedMessagesLength = this.eventsLoadedInstances.length;

    message.args.forEach((instanceToLoad) => {
      if (!this.eventsLoadedInstances.includes(instanceToLoad)) {
        this.eventsLoadedInstances.push(instanceToLoad);
      }
    });

    if (loadedMessagesLength !== this.eventsLoadedInstances.length) {
      const FakeXjs: any = { type: 'local' }; // eslint-disable-line @typescript-eslint/no-explicit-any
      this.eventsInstance = new Events(
        FakeXjs,
        this.eventsLoadedInstances
          .filter((instanceName) => SupportedTransforms[instanceName])
          .map((instanceName) => SupportedTransforms[instanceName])
      );
    }
  }
}
