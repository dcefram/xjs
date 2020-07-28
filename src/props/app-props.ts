import Environment from 'helpers/environment';
import hasRequiredKeys from 'helpers/has-required-keys';
import {
  ReadOnlyError,
  InvalidParamError,
  EnvironmentError,
  WriteOnlyError,
} from 'internal/errors';

type ViewIndex = number | string;
type SceneIdentifier = number | string;

const AppProps = {
  scenes: {
    key: 'sceneconfig',
    setValidator: (xml: string): boolean => {
      if (typeof xml !== 'string') {
        throw new Error('Parameter should be a string');
      }

      return true;
    },
  },

  sceneIndex: {
    key: 'scene:${view}',
    setValidator: (param: {
      view: ViewIndex;
      value: SceneIdentifier;
    }): boolean => {
      const [isValidParam, missingKeys] = hasRequiredKeys(param, [
        'value',
        'view',
      ]);

      if (!isValidParam) {
        throw new InvalidParamError(`Missing keys: ${missingKeys.join(', ')}`);
      }

      return true;
    },
    setTransformer: (value: { value: SceneIdentifier }): string =>
      String(value.value),
    getValidator: (param: { view: ViewIndex }): boolean => {
      const [isValidParam, missingKeys] = hasRequiredKeys(param, ['view']);

      if (!isValidParam) {
        throw new InvalidParamError(`Missing keys: ${missingKeys.join(', ')}`);
      }

      return true;
    },
    getTransformer: (value: string): number => Number(value),
  },

  scenePreset: {
    key: 'scenepreset:${scene}',
    setValidator: (param: {
      value: string;
      scene: SceneIdentifier;
    }): boolean => {
      const [isValidParam, missingKeys] = hasRequiredKeys(param, [
        'value',
        'scene',
      ]);

      if (!isValidParam) {
        throw new InvalidParamError(`Missing keys: ${missingKeys.join(', ')}`);
      }

      if (Environment.isSourcePlugin) {
        throw new EnvironmentError();
      }

      return true;
    },
    setTransformer: (value: { value: string }): string => value.value,
    getValidator: (param: { scene: SceneIdentifier }): boolean => {
      const [isValidParam, missingKeys] = hasRequiredKeys(param, [
        'value',
        'scene',
      ]);

      if (!isValidParam) {
        throw new InvalidParamError(`Missing keys: ${missingKeys.join(', ')}`);
      }

      if (Environment.isSourcePlugin) {
        throw new EnvironmentError();
      }

      return true;
    },
  },

  scenePresetList: {
    key: 'scenepresetlist:${scene}',
    setValidator: (): void => {
      throw new ReadOnlyError();
    },
    getValidator: (param: { scene: SceneIdentifier }): boolean => {
      const [isValidParam, missingKeys] = hasRequiredKeys(param, ['scene']);

      if (!isValidParam) {
        throw new InvalidParamError(`Missing keys: ${missingKeys.join(', ')}`);
      }

      if (Environment.isSourcePlugin) {
        throw new EnvironmentError();
      }

      return true;
    },
    getTransformer: (value: string): string[] => [
      '{00000000-0000-0000-0000-000000000000}',
      ...String(value).split(',').filter(Boolean),
    ],
  },

  sceneNewPreset: {
    key: 'scenenewpreset:${scene}',
    setValidator: (): void => {
      throw new ReadOnlyError();
    },
    getValidator: (param: { scene: SceneIdentifier }): boolean => {
      const [isValidParam, missingKeys] = hasRequiredKeys(param, ['scene']);

      if (!isValidParam) {
        throw new InvalidParamError(`Missing keys: ${missingKeys.join(', ')}`);
      }

      if (Environment.isSourcePlugin) {
        throw new EnvironmentError();
      }

      return true;
    },
  },

  sceneRemovePreset: {
    key: 'sceneremovepreset:${scene}',
    setValidator: (param: {
      value: string;
      scene: SceneIdentifier;
    }): boolean => {
      const [isValidParam, missingKeys] = hasRequiredKeys(param, [
        'scene',
        'value',
      ]);

      if (!isValidParam) {
        throw new InvalidParamError(`Missing keys: ${missingKeys.join(', ')}`);
      }

      if (Environment.isSourcePlugin) {
        throw new EnvironmentError();
      }

      return true;
    },
    setTransformer: (value: { value: string }): string => value.value,
    getValidator: (): void => {
      throw new WriteOnlyError();
    },
  },

  scenePresetTransition: {
    key: 'scenepresettransitionfunc:${scene}',
    setValidator: (param: {
      value: string;
      scene: SceneIdentifier;
    }): boolean => {
      const [isValidParam, missingKeys] = hasRequiredKeys(param, [
        'scene',
        'value',
      ]);

      if (!isValidParam) {
        throw new InvalidParamError(`Missing keys: ${missingKeys.join(', ')}`);
      }

      if (Environment.isSourcePlugin) {
        throw new EnvironmentError();
      }

      return true;
    },
    setTransformer: (value: { value: string }): string =>
      value.value === 'none' ? '' : value.value,
    getValidator: (param: { scene: SceneIdentifier }): boolean => {
      const [isValidParam, missingKeys] = hasRequiredKeys(param, ['scene']);

      if (!isValidParam) {
        throw new InvalidParamError(`Missing keys: ${missingKeys.join(', ')}`);
      }

      if (Environment.isSourcePlugin) {
        throw new EnvironmentError();
      }

      return true;
    },
    getTransformer: (value: string): string => (value === '' ? 'none' : value),
  },

  scenePresetTransitionTime: {
    key: 'scenepresettransitiontime:${scene}',
    setValidator: (param: {
      value: number;
      scene: SceneIdentifier;
    }): boolean => {
      const [isValidParam, missingKeys] = hasRequiredKeys(param, [
        'scene',
        'value',
      ]);

      if (!isValidParam) {
        throw new InvalidParamError(`Missing keys: ${missingKeys.join(', ')}`);
      }

      if (Environment.isSourcePlugin) {
        throw new EnvironmentError();
      }

      return true;
    },
    setTransformer: (value: { value: number }): string => String(value.value),
    getValidator: (param: { scene: SceneIdentifier }): boolean => {
      const [isValidParam, missingKeys] = hasRequiredKeys(param, [
        'scene',
        'value',
      ]);

      if (!isValidParam) {
        throw new InvalidParamError(`Missing keys: ${missingKeys.join(', ')}`);
      }

      if (Environment.isSourcePlugin) {
        throw new EnvironmentError();
      }

      return true;
    },
    getTransformer: (value: string): number => Number(value),
  },

  microphoneDev2: {
    key: 'microphonedev2',
    setValidator: (xml: string): boolean => {
      if (typeof xml !== 'string') {
        throw new Error('Parameter should be a string');
      }

      return true;
    },
  },

  wasapiEnum: {
    key: 'wasapienum',
    setValidator: (xml: string): boolean => {
      if (typeof xml !== 'string') {
        throw new Error('Parameter should be a string');
      }

      return true;
    },
  },

  sceneItems: {
    key: 'sceneconfig:${scene}',
    setValidator: (param: {
      value: string;
      scene: SceneIdentifier;
    }): boolean => {
      const [isValidParam, missingKeys] = hasRequiredKeys(param, [
        'scene',
        'value',
      ]);

      if (!isValidParam) {
        throw new InvalidParamError(`Missing keys: ${missingKeys.join(', ')}`);
      }

      return true;
    },
    setTransformer: (value: { value: string }): string => value.value,
    getValidator: (param: { scene: SceneIdentifier }): boolean => {
      const [isValidParam, missingKeys] = hasRequiredKeys(param, ['scene']);

      if (!isValidParam) {
        throw new InvalidParamError(`Missing keys: ${missingKeys.join(', ')}`);
      }

      return true;
    },
  },

  sceneName: {
    key: 'scenename:${scene}',
    setValidator: (param: {
      value: string;
      scene: SceneIdentifier;
    }): boolean => {
      const [isValidParam, missingKeys] = hasRequiredKeys(param, [
        'value',
        'scene',
      ]);

      if (!isValidParam) {
        throw new InvalidParamError(`Missing keys: ${missingKeys.join(', ')}`);
      }

      return true;
    },
    setTransformer: (value: { value: string }): string => value.value,
    getValidator: (param: { scene: SceneIdentifier }): boolean => {
      const [isValidParam, missingKeys] = hasRequiredKeys(param, ['scene']);

      if (!isValidParam) {
        throw new InvalidParamError(`Missing keys: ${missingKeys.join(', ')}`);
      }

      return true;
    },
  },

  sceneThumbnail: {
    key: 'sceneshot:${scene}:${width},${height}',
    setValidator: (): void => {
      throw new ReadOnlyError();
    },
    getValidator: (param: {
      scene: SceneIdentifier;
      width: number;
      height: number;
    }): boolean => {
      const [isValidParam, missingKeys] = hasRequiredKeys(param, [
        'scene',
        'width',
        'height',
      ]);

      if (!isValidParam) {
        throw new InvalidParamError(`Missing keys: ${missingKeys.join(', ')}`);
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
