export type InstanceList = any[]; // eslint-disable-line @typescript-eslint/no-explicit-any

export type CallbackFunction = (...value: string[]) => void;

export type EventMetaDataType = {
  key: string;
  environmentValidator: () => boolean;
};

export interface ICallbackStack {
  [event: string]: CallbackFunction[];
}
