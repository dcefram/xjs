import isObject from 'lodash/isObject';
import isString from 'lodash/isString';
import { AsyncId, CallbackHandler } from '../core/remote/types';

type CallbackType = (...args: unknown[]) => void;

interface IKeyValuePair {
  [key: string]: CallbackType;
}

const wrapCallbackHandler = (
  callbackFunc: CallbackType,
  oldCallbackFunc: CallbackType
) => (...args: unknown[]) => {
  callbackFunc(...args);
  oldCallbackFunc && oldCallbackFunc(...args);
};

const mapDecodeURIComponent = (value: string | unknown) =>
  isString(value) ? decodeURIComponent(value) : value;

const _callbacks: CallbackHandler = {};

const isCallbackExisting = (asyncId: AsyncId) =>
  _callbacks.hasOwnProperty(asyncId);

export const runCallback = (asyncId: AsyncId, ...asyncRes: string[]): void => {
  if (isCallbackExisting(asyncId)) {
    const { callback, clean } = _callbacks[asyncId];
    callback(...asyncRes.map(mapDecodeURIComponent));
    clean();
  }
};

const registerCallback = (callbacks: IKeyValuePair): void => {
  if (!isObject(callbacks) || Object.keys(callbacks).length === 0) {
    return;
  }

  for (const event in callbacks) {
    const callback = callbacks[event];

    window[event] = wrapCallbackHandler(callback, window[event]);
  }
};

export default registerCallback;
