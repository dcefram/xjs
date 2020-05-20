import Internal from '../../internal';
import App from '../app';

export type SceneId = string;
export type SceneIndex = number;

export interface SceneConfig {
  internal: Internal;
}

export type SceneInfo = {
  index: SceneIndex;
  id: SceneId;
  name: string;
};

export type Placement = {
  defpos: string;
  id: string;
  name: string;
  preset_id: string;
  preset_trtime: string;
  trtime: string;
};

export type Item = {
  id: string;
  srcid: string;
  name: string;
};
