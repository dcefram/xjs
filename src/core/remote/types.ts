export type AsyncId = number;

export interface CallbackHandler {
  [asyncId: number]: {
    callback: Function;
    clean: Function;
  };
}

export interface RequestResult {
  asyncId: AsyncId;
  result: any;
}

export interface RemoteRequest {
  fn: string;
  args: any[];
}

export interface ProxyRequest {
  asyncId: AsyncId;
  fn: string;
  args: any[];
}
