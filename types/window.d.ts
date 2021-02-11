export {};

declare global {
  interface Window {
    OnAsyncCallback: any;
    OnPropsMessageReceive: (payload: string) => any;
    SetEvent: (value: string) => void;
    AppOnEvent: (value: string) => void;
    OnDialogResult: Function;
  }
}
