import isObject from 'lodash-es/isObject';

type RegisterCallbackOptions = {
  cleanup: boolean;
};

type CallbackType = (...args: unknown[]) => void;

interface IKeyValuePair {
  [key: string]: CallbackType;
}

const wrapCallbackHandler = (
  callbackFunc: CallbackType,
  oldCallbackFunc: CallbackType,
  cleanup: boolean
) => (...args: unknown[]) => {
  if (typeof callbackFunc === 'function') {
    callbackFunc(...args);
  }

  oldCallbackFunc && oldCallbackFunc(...args);

  if (cleanup) {
    callbackFunc = null;
  }
};

const registerCallback = (
  callbacks: IKeyValuePair,
  options: Partial<RegisterCallbackOptions> = {}
): void => {
  if (!isObject(callbacks) || Object.keys(callbacks).length === 0) {
    return;
  }

  const { cleanup } = options;
  for (const event in callbacks) {
    if (callbacks.hasOwnProperty(event)) {
      const callback = callbacks[event];
      window[event] = wrapCallbackHandler(callback, window[event], cleanup);
    }
  }
};

export default registerCallback;
