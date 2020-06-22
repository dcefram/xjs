import Internal from 'internal';

export interface PropertyType {
  key: string;
  setValidator: (param: any) => boolean;
  setTransformer: (param: any) => any;
  getValidator: (param: any) => boolean;
  getTransformer: (param: any) => any;
}

export interface ItemInfo {
  id: string;
  srcid: string;
}
