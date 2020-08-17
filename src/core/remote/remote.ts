import { XjsTypes } from 'core/xjs/types';
import request from './request';
import {
  IRequestResult,
  IRequest,
  IEventCallbacks,
  SUBSCRIPTION,
  ClientId,
  ICreateRequest,
  ExecFunc,
  IRemoteConfig,
  IKeyValuePair,
} from './types';
import { parse } from 'helpers/json';
import pick from 'lodash-es/pick';

const EVENT = 'event';
const isEvent = (type: string) => type === EVENT;

export default class Remote {
  private type: XjsTypes;

  private exec: ExecFunc;

  private sender: (...args: unknown[]) => void;

  clientId: string;

  public eventCallbacks: IEventCallbacks = {};

  constructor({ clientId, type, exec }: IRemoteConfig) {
    this.clientId = clientId;
    this.type = type;
    this.exec = exec;
  }

  setSender(sender: (...args: unknown[]) => void): void {
    this.sender = sender;
  }

  // used only by remote
  send(message: ICreateRequest): Promise<unknown> {
    return request.register(message, this.sender);
  }

  receiveMessage(data: string): void {
    const message = parse(data) as IKeyValuePair;

    if (this.isRemote()) {
      if (isEvent(message.type as string)) {
        const { eventName, result } = message;

        this.remote.emitEvent(eventName as string, result);
        return;
      }

      return request.runCallback(
        pick(message, [
          'asyncId',
          'result',
          'from',
          'clientId',
        ]) as IRequestResult
      );
    }

    // PROXY HANDLING
    if (isEvent(message.type as string)) {
      if (message.action === SUBSCRIPTION.ON) {
        this.proxy.registerEvent(
          message.clientId as string,
          message.eventName as string,
          (result: unknown) => {
            this.sender({
              from: XjsTypes.Proxy,
              clientId: message.clientId,
              type: EVENT,
              eventName: message.eventName,
              result,
            });
          }
        );
        return;
      }

      this.proxy.unregisterEvent(
        message.clientId as string,
        message.eventName as string
      );
      return;
    }

    this.processRequest(
      pick(message, ['clientId', 'asyncId', 'fn', 'args']) as IRequest
    );
  }

  async processRequest({
    clientId,
    asyncId,
    fn,
    args,
  }: IRequest): Promise<void> {
    const result = await this.exec(fn, ...(args as (number | string)[]));

    this.sender({
      from: XjsTypes.Proxy,
      clientId,
      asyncId,
      result,
    });
  }

  // EVENTS
  proxy = {
    clientEvents: {},
    getClientEvents: (clientId: ClientId): unknown => {
      if (this.proxy.clientEvents.hasOwnProperty(clientId)) {
        return this.proxy.clientEvents[clientId];
      }

      this.proxy.clientEvents[clientId] = {};

      return this.proxy.clientEvents[clientId];
    },
    registerEvent: (
      clientId: ClientId,
      eventName: string,
      sender: (...args: unknown[]) => void
    ): void => {
      const clientEvents = this.proxy.getClientEvents(clientId);

      clientEvents[eventName] = sender;
    },
    unregisterEvent(clientId: ClientId, eventName: string): void {
      if (this.proxy.clientEvents.hasOwnProperty(clientId)) {
        const clientEvents = this.proxy.getClientEvents(clientId);
        delete clientEvents[eventName];

        if (Object.keys(clientEvents).length === 0) {
          delete this.proxy.clientEvents[clientId];
        }
      }
    },
    emitEvent: (eventName: string, result: string): void => {
      Object.values(this.proxy.clientEvents).forEach((events) => {
        if (events.hasOwnProperty(eventName)) {
          events[eventName](result);
        }
      });
    },
  };

  remote = {
    eventCallbacks: {},
    registerEvent: (
      eventName: string,
      callback: (...args: unknown[]) => void
    ): void => {
      this.remote.eventCallbacks[eventName] = callback;

      this.sender({
        from: XjsTypes.Remote,
        clientId: this.clientId,
        type: 'event',
        action: SUBSCRIPTION.ON,
        eventName,
      });
    },
    unregisterEvent: (eventName: string): void => {
      if (this.eventCallbacks.hasOwnProperty(eventName)) {
        delete this.eventCallbacks[eventName];

        this.sender({
          from: XjsTypes.Remote,
          clientId: this.clientId,
          type: 'event',
          action: SUBSCRIPTION.OFF,
          eventName,
        });
      }
    },
    emitEvent: (eventName: string, result: unknown): void => {
      if (this.remote.eventCallbacks.hasOwnProperty(eventName)) {
        this.remote.eventCallbacks[eventName](result);
      }
    },
  };

  private isRemote() {
    return this.type === XjsTypes.Remote;
  }
}
