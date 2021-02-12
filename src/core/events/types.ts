export type InstanceList = IEventsHandler[]; // eslint-disable-line @typescript-eslint/no-explicit-any

export type CallbackFunction = (...value: unknown[]) => void;

export type EventMetaDataType = {
  key: string;
  environmentValidator: () => boolean;
};

export interface ICallbackStack {
  [event: string]: CallbackFunction[];
}

export interface IEventsHandler {
  eventsHandler(event: string, ...args: string[]): unknown;
}
