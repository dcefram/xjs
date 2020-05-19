import Internal from '../../internal';
import App from '../app';

export interface SceneConfig {
  internal: Internal;
}

export type SceneInfo = {
  index: number;
  id: string;
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
