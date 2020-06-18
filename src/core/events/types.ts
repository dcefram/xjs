export type EventMetaDataType = {
  key: string;
  environmentValidator: () => boolean;
};

export type IWindowCallbacks {
  [windowEvent: string]: Function
}
