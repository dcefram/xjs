type CallbackFunctions = {
  [functionName: string]: Function;
};

/**
 * Safely define a window function that would be called by XSplit as a
 * callback handler. In "Safely", we mean, it won't overwrite existing
 * function definitions.
 *
 * @param callbacks   An object where the key is the callback function name and the value is the function definition
 */
export default function registerCallback(callbacks: CallbackFunctions) {
  Object.keys(callbacks).forEach((key: string) => {
    if (callbacks.hasOwnProperty(key)) {
      const prevFn = window[key];
      window[key] = (...args) => {
        if (typeof prevFn === 'function') {
          prevFn(...args);
        }
        callbacks[key](...args);
      };
    }
  });
}
