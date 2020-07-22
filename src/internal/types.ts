export type CallbackType = (...args: unknown[]) => void;
export type ExecArgument = string | number;
export interface IKeyValuePair {
  [asyncId: string]: CallbackType;
}
