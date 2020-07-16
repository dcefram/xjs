export interface IKeyValuePair {
  [key: string]: unknown;
}

export type PropertyParam = IKeyValuePair | string | boolean | number;

export interface IPropertyType {
  key: string;
  setValidator?: (param: PropertyParam) => boolean;
  setTransformer?: (param: PropertyParam) => string;
  getValidator?: (param: IKeyValuePair) => boolean;
  getTransformer?: (param: IKeyValuePair) => unknown;
}
