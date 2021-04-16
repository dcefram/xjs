import { IAudioProperty } from '../core/app/types';

export const microphoneDev2: IAudioProperty = {
  type: 'audio',
  key: 'microphonedev2',
  setValidator: (xml: string): boolean => {
    if (typeof xml !== 'string') {
      throw new Error('Parameter should be a string');
    }

    return true;
  },
};

export const wasapiEnum: IAudioProperty = {
  type: 'audio',
  key: 'wasapienum',
  setValidator: (xml: string): boolean => {
    if (typeof xml !== 'string') {
      throw new Error('Parameter should be a string');
    }

    return true;
  },
};

export const audioDevices = microphoneDev2;
export const audioDevicesWASAPI = wasapiEnum;
