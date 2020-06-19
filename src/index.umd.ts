import Xjs, { XjsTypes } from './core/xjs';
import App from './core/app';
import Events from './core/events';
import Item from './core/item';
import Preset from './core/preset';
import Remote from './core/remote';
import Scene from './core/scene';
import SourceProperty from './core/source-property-window';
import View from './core/view';
import ItemProps from './props/item-props';
import AppProps from './props/app-props';

export default class Wrapper {
  static XjsTypes = XjsTypes;
  static App = App;
  static Events = Events;
  static Item = Item;
  static Preset = Preset;
  static Remote = Remote;
  static Scene = Scene;
  static SourceProperty = SourceProperty;
  static View = View;
  static ItemProps = ItemProps;
  static AppProps = AppProps;

  constructor(config: any) {
    return new Xjs(config);
  }
}
