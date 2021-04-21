import Xjs, { XjsTypes } from '../src/core/xjs';
import App from '../src/core/app';
import Events from '../src/core/events';
import Item from '../src/core/item';
import Preset from '../src/core/preset';
import Remote from '../src/core/remote/remote';
import Proxy from '../src/core/remote/proxy';
import Scene from '../src/core/scene';
import SourcePropertyWindow from '../src/core/source-property-window';
import View from '../src/core/view';
import ItemProps from '../src/props/item-props';
import * as AudioProps from '../src/props/audio-props';
import * as SceneProps from '../src/props/scene-props';

export default class Wrapper {
  static XjsTypes = XjsTypes;
  static App = App;
  static Events = Events;
  static Item = Item;
  static Preset = Preset;
  static Remote = Remote;
  static Proxy = Proxy;
  static Scene = Scene;
  static SourcePropertyWindow = SourcePropertyWindow;
  static View = View;
  static ItemProps = ItemProps;
  static AppProps = AudioProps;
  static SceneProps = SceneProps;
  static version = Xjs.version;

  constructor(config: any) {
    return new Xjs(config);
  }
}
