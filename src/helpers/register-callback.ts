import isObject from 'lodash-es/isObject';

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
