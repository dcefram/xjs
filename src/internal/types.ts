export type CallbackType = (...args: unknown[]) => void;
export type ExecArgument = string | number;
export type ExternalAsyncResponse = string | number | null | undefined;

export interface IXSplitExternal {
  isXsplitShell: string | undefined;
  CallHost(fn: string, ...args: string[]): ExternalAsyncResponse;
  AppCallFuncAsync(fn: string, ...args: string[]): ExternalAsyncResponse;
  AppGetPropertyAsync(prop: string): ExternalAsyncResponse;
  AppSetPropertyAsync(prop: string, value: string): ExternalAsyncResponse;
  // @TODO: Complete interface structure based on https://docs.google.com/document/d/1eMBesMZB3WNs6slzG-6Mi9fWKf64cCZiE8oFgf9eTYM/edit#heading=h.14jjkkz4fk1z
}

export interface IInternal {
  exec(fn: string, ...args: ExecArgument[]): Promise<string>;
}
