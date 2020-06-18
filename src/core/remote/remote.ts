import { XjsTypes } from 'core/xjs/types';
import request from './request';
import {
  IRequestResult,
  IRequest,
  IEventCallbacks,
  SUBSCRIPTION,
  ClientId,
  ICreateRequest,
} from './types';
import { parse } from '../../helpers';

const EVENT = 'event';

const isEvent = (type: string) => type === EVENT;

export default class Remote {
  private sender: Function;

  private type: XjsTypes;
  private exec: Function;

  clientId: string;

  public eventCallbacks: IEventCallbacks = {};

  constructor({ clientId, type, exec }) {
    this.clientId = clientId;
    this.type = type;
    this.exec = exec;
  }

  setSender(sender: Function) {
    this.sender = sender;
  }

  // used only by remote
  send(message: ICreateRequest): Promise<any> {
    return request.register(message, this.sender);
  }

  receiveMessage(data: string) {
    const message = parse(data);

    if (this.isRemote()) {
      if (isEvent(message.type)) {
        const { eventName, result } = message;

        this.client.emitEvent(eventName, result);
        return;
      }

      return request.runCallback(message as IRequestResult);
    }

    // PROXY HANDLING
    if (isEvent(message.type)) {
      if (message.action === SUBSCRIPTION.ON) {
        this.proxy.registerEvent(
          message.clientId,
          message.eventName,
          (result: any) => {
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

      this.proxy.unregisterEvent(message.clientId, message.eventName);
      return;
    }

    this.processRequest(message);
  }

  async processRequest({ clientId, asyncId, fn, args }: IRequest) {
    const result = await this.exec(fn, ...args);

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
    getClientEvents: (clientId: ClientId) => {
      if (this.proxy.clientEvents.hasOwnProperty(clientId)) {
        return this.proxy.clientEvents[clientId];
      }

      this.proxy.clientEvents[clientId] = {};

      return this.proxy.clientEvents[clientId];
    },
    registerEvent: (
      clientId: ClientId,
      eventName: string,
      sender: Function
    ) => {
      const clientEvents = this.proxy.getClientEvents(clientId);

      clientEvents[eventName] = sender;
    },
    unregisterEvent(clientId: ClientId, eventName: string) {
      if (this.proxy.clientEvents.hasOwnProperty(clientId)) {
        const clientEvents = this.proxy.getClientEvents(clientId);
        delete clientEvents[eventName];

        if (Object.keys(clientEvents).length === 0) {
          delete this.proxy.clientEvents[clientId];
        }
      }
    },
    emitEvent: (eventName, result) => {
      Object.values(this.proxy.clientEvents).forEach(events => {
        if (events.hasOwnProperty(eventName)) {
          events[eventName](result);
        }
      });
    },
  };

  client = {
    eventCallbacks: {},
    registerEvent: (eventName, callback: Function) => {
      this.client.eventCallbacks[eventName] = callback;

      this.sender({
        from: XjsTypes.Remote,
        clientId: this.clientId,
        type: 'event',
        action: SUBSCRIPTION.ON,
        eventName,
      });
    },
    unregisterEvent: eventName => {
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
    emitEvent: (eventName: string, result: any) => {
      if (this.client.eventCallbacks.hasOwnProperty(eventName)) {
        this.client.eventCallbacks[eventName](result);
      }
    },
  };

  private isRemote() {
    return this.type === XjsTypes.Remote;
  }
}
