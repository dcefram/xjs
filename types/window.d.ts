export {};

declare global {
  interface Window {
    OnAsyncCallback: any;
    OnPropsMessageReceive: (payload: string) => any;
    // external: XSplitExternal; // @TODO: Typescript does not yet allow this...
  }
}
