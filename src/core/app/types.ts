export interface IKeyValuePair {
  [key: string]: unknown;
}

export interface IPropertyType {
  key: string;
  setValidator?: (param: IKeyValuePair) => boolean;
  setTransformer?: (param: IKeyValuePair) => unknown;
  getValidator?: (param: IKeyValuePair) => boolean;
  getTransformer?: (param: IKeyValuePair) => unknown;
}
