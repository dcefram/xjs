import { XjsTypes } from 'core/xjs/types';
import { ExecArgument } from 'internal/types';

export type AsyncId = number;
export type ClientId = string;

export interface CallbackHandler {
  [asyncId: number]: {
    callback: (...args: unknown[]) => void;
    clean: () => void;
  };
}

export enum SUBSCRIPTION {
  ON = 'subscribe',
  OFF = 'unsubscribe',
}

export type ExecFunc = (fn: string, ...args: ExecArgument[]) => Promise<string>;

export interface IRemoteConfig {
  clientId: string;
  type: XjsTypes;
  exec: ExecFunc;
}

export interface IKeyValuePair {
  [key: string]: unknown;
}

// REMOTE INTERFACES

interface IRemote {
  from: XjsTypes.Remote;
  clientId: ClientId;
}

export interface ICreateRequest extends IRemote {
  fn: string;
  args: unknown[];
}

export interface IRequest extends IRemote {
  asyncId: AsyncId;
  fn: string;
  args: unknown[];
}

export interface IRequestResult extends IRemote {
  asyncId: AsyncId;
  result: unknown;
}

// PROXY INTERFACES

interface IProxy {
  from: XjsTypes.Proxy;
  clientId: ClientId;
}

export interface IProxyEventResult extends IProxy {
  eventName: string;
  result: unknown;
}

export interface IEventCallbacks {
  [eventName: string]: (...args: unknown[]) => void;
}
