import { IWindowCallbacks } from './types';
import { XjsTypes } from '../xjs';
import Remote from '../remote';
import { APP_ON_EVENT } from './const';
/**
 * @TODO: This is currently only used for stream events
 */

const eventCallbacks = {};

function wrapCallbackHandler(callbackFunc, oldCallbackFunc) {
  return (...args: any[]) => {
    callbackFunc(...args);
    oldCallbackFunc && oldCallbackFunc(...args);
  };
}

function registerCallback(callbacks: IWindowCallbacks) {
  Object.entries(callbacks).forEach(([funcName, callback]) => {
    window[funcName] = wrapCallbackHandler(callback, window[funcName]);
  });
}

function parseSegments(segments: string[]): any {
  const parsed = segments.reduce((obj, current) => {
    const [key, value] = String(current).split('=');

    return { ...obj, [key]: decodeURIComponent(value) };
  }, {});

  return parsed;
}

export default class Events {
  remote: Remote;

  constructor({ type, remote }) {
    if ([XjsTypes.Proxy, XjsTypes.Local].includes(type)) {
      this.remote = remote;
      this.initCallbackListeners();
    }
  }

  initCallbackListeners() {
    registerCallback({
      SetEvent(value: string) {
        const segments = String(value).split('&');
        const { event, info } = parseSegments(segments);

        if (Array.isArray(eventCallbacks[event])) {
          eventCallbacks[event].forEach(callback => {
            if (typeof callback === 'function') {
              callback(decodeURIComponent(info));
            }
          });
        }
      },
      AppOnEvent(_event: string, ...args: any) {
        // const event = _event.toLowerCase();
        // SUBSCRIPTIONS_LIST.forEach((subscription) => {
        //   if (subscription.hasOwnProperty(event)) {
        //     return subscription[event](args);
        //   }
        // });

        if (APP_ON_EVENT.SCENE_CHANGE) {
          console.warn;
        }
      },
    });
  }

  subscribe(eventName: string, callback: Function) {
    eventCallbacks[eventName] = callback;
  }

  unsubscribe(eventName: string) {
    delete eventCallbacks[eventName];
  }
}

/*
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
 */
