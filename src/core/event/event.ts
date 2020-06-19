import Xjs, { XjsTypes } from 'core/xjs';
import registerCallback from 'helpers/register-callback';

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

  constructor(xjs: Xjs) {
    this.xjs = xjs;

    registerCallback({
      // SetEvent(value: string) {
      //   const segments = String(value).split('&');
      //   const { event, info } = parseSegments(segments);

      //   if (Array.isArray(eventCallbacks[event])) {
      //     eventCallbacks[event].forEach(callback => {
      //       if (typeof callback === 'function') {
      //         callback(decodeURIComponent(info));
      //       }
      //     });
      //   }
      // },
      AppOnEvent: (eventName: string, ...args: any) => {
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

        if (eventName === 'SceneChange') {
          console.log('AppOnEvent', eventName, ...args);
          this.emitEvent(eventName, args);
        }
      },
    });
  }

  emitEvent(eventName: string, result: string) {
    if (eventCallbacks.hasOwnProperty(eventName)) {
      eventCallbacks[eventName](result);
    }

    if (this.xjs.remote && this.xjs.isProxy()) {
      this.xjs.remote.proxy.emitEvent(eventName, result);
    }
  }

  on(eventName: string, callback: Function) {
    if (this.xjs.isRemote()) {
      this.xjs.remote.remote.registerEvent(eventName, callback);
      return;
    }
    eventCallbacks[eventName] = callback;
  }

  off(eventName: string) {
    if (this.xjs.isRemote()) {
      this.xjs.remote.remote.unregisterEvent(eventName);
      return;
    }
    delete eventCallbacks[eventName];
  }
}
