export interface IKeyValuePair {
  [key: string]: unknown;
}

export type PropertyParam = IKeyValuePair | string | boolean | number;

export interface IPropertyType {
  key: string;
  setValidator?: (param: unknown) => boolean | void;
  setTransformer?: (param: unknown) => string;
  getValidator?: (param: unknown) => boolean | void;
  getTransformer?: (param: string) => unknown;
}
