export interface IKeyValuePair {
  [key: string]: unknown;
}

export type PropertyParam = IKeyValuePair | string | boolean | number;

export interface IPropertyType {
  key: string;
  setValidator?: (param: any) => boolean | void;
  setTransformer?: (param: any) => string;
  getValidator?: (param: any) => boolean | void;
  getTransformer?: (param: string) => unknown;
}
