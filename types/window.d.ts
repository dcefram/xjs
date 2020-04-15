export {};

declare global {
  interface Window {
    OnAsyncCallback: any;
    OnPropsMessageReceive: (payload: string) => any;
    SetEvent: (value: string) => void;
    // external: XSplitExternal; // @TODO: Typescript does not yet allow this...
  }
}
