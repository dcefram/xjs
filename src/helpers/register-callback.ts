import isObject from 'lodash/isObject';
import isString from 'lodash/isString';
import { AsyncId, CallbackHandler } from '../core/remote/types';

const wrapCallbackHandler = (
  callbackFunc: Function,
  oldCallbackFunc: Function
) => (...args: any[]) => {
  callbackFunc(...args);
  oldCallbackFunc && oldCallbackFunc(...args);
};

const mapDecodeURIComponent = (value: any) =>
  isString(value) ? decodeURIComponent(value) : value;

export const ASYNC_CALLBACK_TIMEOUT = 60000;

const _callbacks: CallbackHandler = {};

const isCallbackExisting = (asyncId: AsyncId) =>
  _callbacks.hasOwnProperty(asyncId);

export const runCallback = (asyncId: AsyncId, ...asyncRes: any[]) => {
  if (isCallbackExisting(asyncId)) {
    const { callback, clean } = _callbacks[asyncId];
    callback(...asyncRes.map(mapDecodeURIComponent));
    clean();
  }
};

const registerCallback = (callbacks: object) => {
  if (!isObject(callbacks) || Object.keys(callbacks).length === 0) {
    return;
  }

  for (const event in callbacks) {
    const callback = callbacks[event];

    window[event] = wrapCallbackHandler(callback, window[event]);
  }
};

export default registerCallback;
