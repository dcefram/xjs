export interface IKeyValuePair {
  [key: string]: unknown;
}

export type PropertyParam = IKeyValuePair | string | boolean | number;

export interface ISceneSceneParam extends IKeyValuePair {
  scene: string | number;
}

export interface ISceneViewParam extends IKeyValuePair {
  view: string | number;
}

export interface ISceneSceneWidthHeightParam extends IKeyValuePair {
  scene: string | number;
  width: number;
  height: number;
}

export interface IPropertyType {
  key: string;
  type?: string;
  setValidator?: (param: unknown) => boolean | void;
  setTransformer?: (param: unknown) => string;
  getValidator?: (param: unknown) => boolean | void;
  getTransformer?: (param: string) => unknown;
}

export interface IAudioProperty extends IPropertyType {
  type: 'audio';
}

export interface ISceneProperty extends IPropertyType {
  type: 'scene';
}

export interface ISceneViewProperty extends IPropertyType {
  type: 'scene:view';
}

export interface ISceneSceneProperty extends IPropertyType {
  type: 'scene:scene';
}

export interface ISceneSceneWidthHeightProperty extends IPropertyType {
  type: 'scene:scene:width:height';
}
