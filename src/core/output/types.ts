export interface IChannelName {
  name: string;
}

export interface IChannels {
  channel: IChannelName[];
}

export interface IBroadcastChannelList {
  channels: IChannels;
}

export interface IVideo {
  codec: string;
  x264Presets: string;
  cbr: string;
  adaptivebr: string;
  keyint: string;
  bufferSize: string;
  maxBitrate: string;
  resizeex: string;
  dontUseDefaultMixerResolution: string;
  dontUseDefaultMixerFPS: string;
}

export interface IAudio {
  bitrate: string;
  codec: string;
  multitrack: string;
  format: string;
  format2: string;
}

export interface IConfiguration {
  video: IVideo;
  audio: IAudio;
}

export interface ISpeex {
  vbr: string;
  q: string;
  vmrq: string;
  vbrmax: string;
  abr: string;
  complexity: string;
  vad: string;
  dtx: string;
  hp: string;
}

export interface IExtra {
  params: string;
  speex: ISpeex;
}

export interface IHotkeyDetails {
  name: string;
  desc: string;
  category: string;
  keyCode2: string;
}

type IHotkey = {
  HotKey: IHotkeyDetails;
};

export interface IChannelDetails {
  configuration: IConfiguration;
  extra: IExtra;
  hotkey: IHotkey;
  pluginVersion: string;
  serviceName: string;
  name: string;
  displayName: string;
  rtmpUrl: string;
  link: string;
  username: string;
  password: string;
  channel: string;
  recordBroadcast: string;
  filetype: string;
}

export interface IBroadcastChannelDetails {
  channel: IChannelDetails;
}

export interface IRtmpStat {
  name: string;
  gopdrop: string;
}

export interface IChannel {
  name: string;
  stat: IStat;
  rtmpstat: IRtmpStat;
  channel: IChannelDetails;
}

export interface IStat {
  channel: IChannel[];
}

export interface IGeneratedInterface {
  stat: IStat;
}
