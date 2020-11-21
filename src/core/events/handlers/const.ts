// @TODO: Remove file

export const APP_ON_EVENT = {
  PROPERTY_CHANGE: 'onpropertychange',
  SCENE_DELETE: 'onscenedelete',
  SCENE_ADD: 'onsceneadd',
  SCENE_CHANGE: 'scenechange',
  SPLIT_MODE_GET: 'scenedlg:1',
  SOURCE_TOGGLE: 'videoitemmultisel',
  PRESET_CHANGE: 'videoitemmultisel',
  AUDIO_DEVICE_TOGGLE: {
    CLASSIC_VIEW: 'scenedlg:0',
    SPLIT_VIEW: 'scenedlg:1',
  },
};

// sub events of APP_EVENT onpropertychange
export const PROPERTY_CHANGE = {
  GLOBAL_EVENT: 'globalprop:Event',
  PRESET_ADD: 'scenepreset',
  PRESET_REMOVE: 'sceneremovepreset',
};

export const ON_EVENT = {
  ITEM_PROP_CHANGE: 'itempropchange',
};

export const SOURCE_PROP_CHANGE = {
  VISIBILITY: 'prop:visible',
  MUTE: 'prop:mute',
};

export const AUDIO_DEVICE_TOGGLE = {
  MICROPHONE: 'OnMicEnableClicked',
  SPEAKER: 'OnSpkEnableClicked',
  MICROPHONE_DEV_2: 'microphonedev2',
};
