export type ValueParam = string | boolean | number;

export interface IItemInfo {
  id: string;
  srcid: string;
}

export interface IPropertyParam extends IItemInfo {
  value?: ValueParam;
}

export interface IPropertyType {
  key: string;
  setValidator?: (param: any) => boolean | void;
  setTransformer?: (param: any) => string;
  getValidator?: (param: any) => boolean | void;
  getTransformer?: (param: any) => unknown;
}

export interface IItem {
  pos_left: string;
  pos_top: string;
  pos_right: string;
  pos_bottom: string;
  pos_an: string;
  crop_left: string;
  crop_top: string;
  crop_right: string;
  crop_bottom: string;
  crop_an: string;
  pixalign: string;
  zorder: string;
  lockmove: string;
  keep_ar: string;
  visible: string;
  visible_an: string;
  alpha: string;
  alpha_an: string;
  border: string;
  cc_brightness: string;
  cc_contrast: string;
  cc_hue: string;
  cc_saturation: string;
  cc_dynamicrange: string;
  cc_brightness_an: string;
  cc_contrast_an: string;
  cc_hue_an: string;
  cc_saturation_an: string;
  key_antialiasing: string;
  key_chromakey: string;
  key_chromakeytype: string;
  key_chromahue: string;
  key_chromarang: string;
  key_chromaranga: string;
  key_chromabr: string;
  key_chromasat: string;
  key_colorrgb: string;
  key_colorrang: string;
  key_colorranga: string;
  key_chromargbkeyprimary: string;
  key_chromargbkeythresh: string;
  key_chromargbkeybalance: string;
  pan: string;
  pan_config: string;
  rotate_x: string;
  rotate_y: string;
  rotate_z: string;
  rotate_canvas: string;
  rotate_x_an: string;
  rotate_y_an: string;
  rotate_z_an: string;
  offset_x: string;
  offset_y: string;
  ShowPosition: string;
  transitiontime: string;
  trscenter: string;
  trscexit: string;
  edgeeffectmaskmode: string;
  id: string;
  srcid: string;
  type: string;
  name: string;
  item: string;
  volume: string;
  mute: string;
  keepaudio: string;
  sounddev: string;
  mipmaps: string;
  autoresdet: string;
  keeploaded: string;
  RefreshOnScnLoad: string;
  RefreshOnSrcShow: string;
  zoom: string;
  or_enable: string;
  or_mode: string;
  or_angle: string;
  cc_pin: string;
  key_pin: string;
  edgeeffect_pin: string;
  effects_pin: string;
  key_smartcamenable: string;
  tobii: string;
  tobiiconfig: string;
  StreamDelay: string;
  AudioDelay: string;
  AudioGainEnable: string;
  AudioGain: string;
  AudioGainLatency: string;
  LiveClockSync: string;
  LiveDetectSignal: string;
  fdeinterlace: string;
  InPoint: string;
  OutPoint: string;
  OpWhenFinished: string;
  StartOnLoad: string;
  StartOnSrcShow: string;
  RememberPosition: string;
  LastPosition: string;
  LastRunState: string;
  ScrCapMethod: string;
  ScrCapLayered: string;
  ScrCapOptCapture1: string;
  ScrCapShowMouse: string;
  ScrCapShowClicks: string;
  ScrCapTrackWindowTitle: string;
  GameCapShowMouse: string;
  GameCapSurfSharing: string;
  GameCapEnc: string;
  GameCapAlpha: string;
  GameCapPlSmooth: string;
  GameCapFrameTimeLimit: string;
  GameCapTrackActive: string;
  GameCapTrackActiveFullscreen: string;
  GameCapHideInactive: string;
  BrowserSizeX: string;
  BrowserSizeY: string;
  BrowserTransparent: string;
  BrowserRightClick: string;
  BrowserCookieFlags: string;
  Browser60fps: string;
  BrowserZoom: string;
  SwfWrapper: string;
}

export interface IPlacement {
  item: IItem[];
  name: string;
  id: string;
  preset_id: string;
  preset_trtime: string;
  defpos: string;
  trtime: string;
}

export interface IPresproperty {
  __map_id: string;
  '#text': number;
}

export interface IScriptProperty {
  presproperty: IPresproperty[];
  __map_id: string;
}

export interface IConfiguration {
  placement: IPlacement[];
  global: string;
  scriptproperty: IScriptProperty[];
  cur: string;
}

export interface ISceneConfig {
  configuration: IConfiguration;
}
