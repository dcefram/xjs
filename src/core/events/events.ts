import { EventMetaDataType } from './types';

/**
 * @TODO: This is currently only used for stream events
 */

let eventCallbacks = {};
function parseSegments(segments: string[]): any {
  const parsed = segments.reduce((obj, current) => {
    const [key, value] = String(current).split('=');

    return { ...obj, [key]: decodeURIComponent(value) };
  }, {});

  return parsed;
}

window.SetEvent = (value: string) => {
  const segments = String(value).split('&');
  const { event, info } = parseSegments(segments);

  if (Array.isArray(eventCallbacks[event])) {
    eventCallbacks[event].forEach(callback => {
      if (typeof callback === 'function') {
        callback(decodeURIComponent(info));
      }
    });
  }
};

export default {
  subscribe: ({ environmentValidator, key }: EventMetaDataType, callback) => {
    if (typeof environmentValidator === 'function' && !environmentValidator()) {
      return;
    }

    if (typeof eventCallbacks[key] === 'undefined') {
      eventCallbacks[key] = [];
    }

    eventCallbacks[key].push(callback);
  },
};
