class AppProps {
  static scenes = {
    key: 'sceneconfig',
    setValidator: (xml: string) => {
      if (typeof xml !== 'string') {
        throw new Error('Parameter should be a string');
      }

      return true;
    },
  };

  static sceneIndex = {
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
    getValidator: (param) => {
      if (typeof param !== 'object' || typeof param.view === 'undefined') {
        throw new Error(
          'Parameter should be an object with a `value` property'
        );
      }

      return true;
    },
  };

  static scenePreset = {
    key: 'scenepreset',
    setValidator: (xml: string) => {
      if (typeof xml !== 'string') {
        throw new Error('Parameter should be a string');
      }

      return true;
    },
  };

  static scenePresetList = {
    key: 'scenepresetlist',
    setValidator: (xml: string) => {
      if (typeof xml !== 'string') {
        throw new Error('Parameter should be a string');
      }

      return true;
    },
  };

  static microphoneDev2 = {
    key: 'microphonedev2',
    setValidator: (xml: string) => {
      if (typeof xml !== 'string') {
        throw new Error('Parameter should be a string');
      }

      return true;
    },
  };

  static wasapiEnum = {
    key: 'wasapienum',
    setValidator: (xml: string) => {
      if (typeof xml !== 'string') {
        throw new Error('Parameter should be a string');
      }

      return true;
    },
  };

  static sceneItems = {
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
  };

  static sceneName = {
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
  };

  static audioDevices = AppProps.microphoneDev2;

  static audioDevicesWASAPI = AppProps.wasapiEnum;
}

export default AppProps;
