import Environment from 'helpers/environment';
import hasRequiredKeys from 'helpers/has-required-keys';
import {
  ReadOnlyError,
  InvalidParamError,
  EnvironmentError,
  WriteOnlyError,
} from 'internal/errors';
import {
  ISceneProperty,
  ISceneSceneProperty,
  ISceneSceneWidthHeightProperty,
  ISceneViewProperty,
} from 'core/app/types';

type ViewIndex = number | string;
type SceneIdentifier = number | string;

export const scenes: ISceneProperty = {
  type: 'scene',
  key: 'sceneconfig',
  setValidator: (xml: string): boolean => {
    if (typeof xml !== 'string') {
      throw new Error('Parameter should be a string');
    }

    return true;
  },
};

export const sceneIndex: ISceneViewProperty = {
  type: 'scene:view',
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
};

export const scenePreset: ISceneSceneProperty = {
  type: 'scene:scene',
  key: 'scenepreset:${scene}',
  setValidator: (param: { value: string; scene: SceneIdentifier }): boolean => {
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
    const [isValidParam, missingKeys] = hasRequiredKeys(param, ['scene']);

    if (!isValidParam) {
      throw new InvalidParamError(`Missing keys: ${missingKeys.join(', ')}`);
    }

    if (Environment.isSourcePlugin) {
      throw new EnvironmentError();
    }

    return true;
  },
};

export const scenePresetList: ISceneSceneProperty = {
  type: 'scene:scene',
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
};

export const sceneNewPreset: ISceneSceneProperty = {
  type: 'scene:scene',
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
};

export const sceneRemovePreset: ISceneSceneProperty = {
  type: 'scene:scene',
  key: 'sceneremovepreset:${scene}',
  setValidator: (param: { value: string; scene: SceneIdentifier }): boolean => {
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
};

export const scenePresetTransition: ISceneSceneProperty = {
  type: 'scene:scene',
  key: 'scenepresettransitionfunc:${scene}',
  setValidator: (param: { value: string; scene: SceneIdentifier }): boolean => {
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
};

export const scenePresetTransitionTime: ISceneSceneProperty = {
  type: 'scene:scene',
  key: 'scenepresettransitiontime:${scene}',
  setValidator: (param: { value: number; scene: SceneIdentifier }): boolean => {
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
};

export const sceneItems: ISceneSceneProperty = {
  type: 'scene:scene',
  key: 'sceneconfig:${scene}',
  setValidator: (param: { value: string; scene: SceneIdentifier }): boolean => {
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
};

export const sceneName: ISceneSceneProperty = {
  type: 'scene:scene',
  key: 'scenename:${scene}',
  setValidator: (param: { value: string; scene: SceneIdentifier }): boolean => {
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
};

export const sceneThumbnail: ISceneSceneWidthHeightProperty = {
  type: 'scene:scene:width:height',
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
};
