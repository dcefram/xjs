import { IMessenger } from 'core/remote/types';

export interface IKeyValuePair {
  [key: string]: unknown;
}

export enum XjsTypes {
  Local = 'local',
  Remote = 'remote', // Connect to a Proxy, send commands to proxy
  Proxy = 'proxy', // Accept remote calls, send back responses to origin
}

export enum XjsEnvironments {
  Extension = 'extension',
  Source = 'source',
  Shell = 'shell,',
}

export enum LogVerbosity {
  None = 'none',
  Warning = 'warning',
  Debug = 'debug',
}

export interface IConfig {
  type?: XjsTypes;
  environment?: XjsEnvironments;
  logVerbosity?: LogVerbosity;
  version?: string;
  logger?: unknown;
  messenger?: IMessenger;
}

export interface IConfigRemote extends IConfig {
  type: XjsTypes.Remote;
}
