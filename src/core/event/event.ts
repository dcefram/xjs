import Xjs from '../xjs';
import { APP_ON_EVENT } from './const';
import registerCallback from '../../helpers/register-callback';

const eventCallbacks = {};

function parseSegments(segments: string[]): any {
  const parsed = segments.reduce((obj, current) => {
    const [key, value] = String(current).split('=');

    return { ...obj, [key]: decodeURIComponent(value) };
  }, {});

  return parsed;
}

export default class Events {
  xjs: Xjs;

  constructor(xjs) {
    this.xjs = xjs;

    this.initCallbackListeners();
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
        // if (APP_ON_EVENT.SCENE_CHANGE) {
        //   const sceneInfo = this.scene.getActive();
        //   this.emitEvent('scene-change', sceneInfo);
        // }
      },
    });
  }

  emitEvent(eventName, result) {
    //
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
