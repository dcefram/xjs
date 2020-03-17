import Internal from '../../internal';

export interface ItemConfig {
  internal: Internal;
  id: string;
  srcId: string;
  isCurrentItem?: boolean;
}

export interface PropertyType {
  key: string;
  setValidator: (param: any) => boolean;
  setTransformer: (param: any) => any;
  getValidator: (param: any) => boolean;
  getTransformer: (param: any) => any;
}
