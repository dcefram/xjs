import Environment from 'helpers/Environment';

const AppProps = {
  scenes: {
    key: 'sceneconfig',
    setValidator: (xml: string) => {
      if (typeof xml !== 'string') {
        throw new Error('Parameter should be a string');
      }

      return true;
    },
  },

  sceneIndex: {
    key: 'scene:${view}',
    setValidator: (param: any) => {
      if (
        typeof param !== 'object' ||
        typeof param.value === 'undefined' ||
        typeof param.view === 'undefined'
      ) {
        throw new Error(
          'Parameter should be an object with properties `value` and `view`'
        );
      }

      return true;
    },
    setTransformer: (value: any) => value.value,
    getValidator: param => {
      if (typeof param !== 'object' || typeof param.view === 'undefined') {
        throw new Error(
          'Parameter should be an object with a `value` property'
        );
      }

      return true;
    },
  },

  scenePreset: {
    key: 'scenepreset:${scene}',
    setValidator: (param: any) => {
      if (
        typeof param !== 'object' ||
        typeof param.value === 'undefined' ||
        typeof param.scene === 'undefined'
      ) {
        throw new Error(
          'Parameter should be an object with properties `value` and `scene`. `scene` should be the scene\'s UID'
        );
      }

      if (Environment.isSourcePlugin) {
        throw new Error('Not supported on source plugins');
      }

      return true;
    },
    getValidator: (param: any) => {
      if (typeof param !== 'object' || typeof param.scene === 'undefined') {
        throw new Error('Parameter should be an object with property `scene`. `scene` should be the scene\'s UID');
      }

      if (Environment.isSourcePlugin) {
        throw new Error('Not supported on source plugins');
      }

      return true;
    },
  },

  scenePresetList: {
    key: 'scenepresetlist:${scene}',
    setValidator: () => false,
    setTransformer: () => null,
    getValidator: (param: any) => {
      if (typeof param !== 'object' || typeof param.scene === 'undefined') {
        throw new Error('Parameter should be an object with property `scene`. `scene` should be the scene\'s UID');
      }

      if (Environment.isSourcePlugin) {
        throw new Error('Not supported on source plugins');
      }

      return true;
    },
    getTransformer: (value: string) => String(value).split(','),
  },

  sceneNewPreset: {
    key: 'scenenewpreset:${scene}',
    setValidator: () => {
      throw new Error('This method is Read-only');
    },
    getValidator: (param: any) => {
      if (typeof param !== 'object' || typeof param.scene === 'undefined') {
        throw  new Error('Parameter should be an object with property `scene`. `scene` should be the scene\'s UID');
      }

      if (Environment.isSourcePlugin) {
        throw new Error('Not supported on source plugins');
      }

      return true;
    },
  },

  sceneRemovePreset: {
    key: 'sceneremovepreset:${scene}',
    setValidator: (param: any) => {
      if (
        typeof param !== 'object' ||
        typeof param.value === 'undefined' ||
        typeof param.scene === 'undefined'
      ) {
        throw new Error(
          'Parameter should be an object with properties `value` and `scene`. `scene` should be the scene\'s UID'
        );
      }

      if (Environment.isSourcePlugin) {
        throw new Error('Not supported on source plugins');
      }

      return true;
    },
    getValidator: () => {
      throw new Error('You can only use this method in `setProperty`');
    },
  },

  scenePresetTransition: {
    key: 'scenepresettransitionfunc:${scene}',
    setValidator: (param: any) => {
      if (
        typeof param !== 'object' ||
        typeof param.value === 'undefined' ||
        typeof param.scene === 'undefined'
      ) {
        throw new Error(
          'Parameter should be an object with properties `value` and `scene`. `scene` should be the scene\'s UID'
        );
      }

      if (Environment.isSourcePlugin) {
        throw new Error('Not supported on source plugins');
      }

      return true;
    },
    setTransformer: (value: string) => value === 'none' ? '' : value,
    getValidator: (param: any) => {
      if (typeof param !== 'object' || typeof param.scene === 'undefined') {
        throw  new Error('Parameter should be an object with property `scene`. `scene` should be the scene\'s UID');
      }

      if (Environment.isSourcePlugin) {
        throw new Error('Not supported on source plugins');
      }

      return true;
    },
    getTransformer: (value: string) => value === '' ? 'none' : value,
  },

  scenePresetTransitionTime: {
    key: 'scenepresettransitiontime:${scene}',
    setValidator: (param: any) => {
      if (
        typeof param !== 'object' ||
        typeof param.value !== 'number' ||
        typeof param.scene === 'undefined'
      ) {
        throw new Error(
          'Parameter should be an object with properties `value` of type Number and `scene` of type String. `scene` should be the scene\'s UID'
        );
      }

      if (Environment.isSourcePlugin) {
        throw new Error('Not supported on source plugins');
      }

      return true;
    },
    setTransformer: (value: number) => String(value),
    getValidator: (param: any) => {
      if (typeof param !== 'object' || typeof param.scene === 'undefined') {
        throw  new Error('Parameter should be an object with property `scene`. `scene` should be the scene\'s UID');
      }

      if (Environment.isSourcePlugin) {
        throw new Error('Not supported on source plugins');
      }

      return true;
    },
    getTransformer: (value: string) => Number(value),
  },

  microphoneDev2: {
    key: 'microphonedev2',
    setValidator: (xml: string) => {
      if (typeof xml !== 'string') {
        throw new Error('Parameter should be a string');
      }

      return true;
    },
  },

  wasapiEnum: {
    key: 'wasapienum',
    setValidator: (xml: string) => {
      if (typeof xml !== 'string') {
        throw new Error('Parameter should be a string');
      }

      return true;
    },
  },

  sceneItems: {
    key: 'sceneconfig:${scene}',
    setValidator: (param: any) => {
      if (
        typeof param !== 'object' ||
        typeof param.value === 'undefined' ||
        typeof param.scene === 'undefined'
      ) {
        throw new Error(
          'Parameter should be an object with properties `value` and `scene`'
        );
      }

      return true;
    },
    setTransformer: (value: any) => value.value,
    getValidator: (param: any) => {
      if (typeof param !== 'object' || typeof param.scene === 'undefined') {
        throw new Error(
          'Parameter should be an object with a `scene` property'
        );
      }

      return true;
    },
  },

  sceneName: {
    key: 'scenename:${scene}',
    setValidator: (param: any) => {
      if (
        typeof param !== 'object' ||
        typeof param.value === 'undefined' ||
        typeof param.scene === 'undefined'
      ) {
        throw new Error(
          'Parameter should be an object with properties `value` and `scene`'
        );
      }

      return true;
    },
    setTransformer: (value: any) => value.value,
    getValidator: (param: any) => {
      if (typeof param !== 'object' || typeof param.scene === 'undefined') {
        throw new Error(
          'Parameter should be an object with a `scene` property'
        );
      }

      return true;
    },
  },

  audioDevices: {},
  audioDevicesWASAPI: {},
};

// @HACK
AppProps.audioDevices = AppProps.microphoneDev2;
AppProps.audioDevicesWASAPI = AppProps.wasapiEnum;

export default AppProps;
