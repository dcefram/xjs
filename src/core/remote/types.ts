export type SendMessage = (message: IRemoteMessage | IProxyMessage) => void;
export type ReceiveMessage = (message: IRemoteMessage | IProxyMessage) => void;

export interface IMessenger {
  send: SendMessage;
  receive: ReceiveMessage;
}

export interface IRemoteConfig {
  messenger: IMessenger;
}

export interface IRemoteMessage {
  remoteId: string;   // A unique identifier for each XJS Remote instance
  asyncId: number;    // A `supposedly` auto-incremented counter used to know who requested the data when proxy responds
  funcName: string;   // The external method
  args: string[];     // The arguments passed to the external method. I think C++ only accepts strings, so it's should be safe to do this
}

export interface IProxyMessage {
  proxyId: string;    // A unique identifier for each XJS Proxy instance
  remoteId: string;   // The ID of the XJS Remote instance that requested to execute a particular function
  asyncId: number;    // The ID of the command that it received from supposedly a Remote XJS instance
  result: string;     // The return value of the XSplit method
}
