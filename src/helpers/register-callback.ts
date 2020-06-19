import isObject from 'lodash/isObject';

const wrapCallbackHandler = (
  callbackFunc: Function,
  oldCallbackFunc: Function
) => (...args: any[]) => {
  callbackFunc(...args);
  oldCallbackFunc && oldCallbackFunc(...args);
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
