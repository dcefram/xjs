import { XjsTypes } from '../xjs/types';

export type AsyncId = number;
export type ClientId = string;

export interface CallbackHandler {
  [asyncId: number]: {
    callback: Function;
    clean: Function;
  };
}

export enum SUBSCRIPTION {
  ON = 'subscribe',
  OFF = 'unsubscribe',
}

// REMOTE INTERFACES

interface IRemote {
  from: XjsTypes.Remote;
  clientId: ClientId;
}

export interface ICreateRequest extends IRemote {
  fn: string;
  args: any[];
}

export interface IRequest extends IRemote {
  asyncId: AsyncId;
  fn: string;
  args: any[];
}

export interface IRequestResult extends IRemote {
  asyncId: AsyncId;
  result: any;
}

// PROXY INTERFACES

interface IProxy {
  from: XjsTypes.Proxy;
  clientId: ClientId;
}

export interface IProxyEventResult extends IProxy {
  eventName: string;
  result: any;
}

export interface IEventCallbacks {
  [eventName: string]: Function;
}
