export {};

declare global {
  interface Window {
    OnAsyncCallback: any;
    OnPropsMessageReceive: (payload: string) => any;
    SetEvent: (value: string) => void;
    AppOnEvent: (value: string, ...args: number[] | string[]) => void;
    OnDialogResult: Function;
  }
}
