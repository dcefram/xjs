import Xjs from 'core/xjs';

import registerCallback from 'helpers/register-callback';
import parseQueryString from 'helpers/parse-query-string';
import asyncReduce from 'helpers/async-reduce';

import { InstanceList, ICallbackStack, CallbackFunction } from './types';

export default class Events {
  xjs: Xjs;
  callbacks: ICallbackStack = {};
  instances: InstanceList;

  constructor(xjs: Xjs, instances?: InstanceList) {
    this.xjs = xjs;
    this.instances = instances ? instances : [];

    registerCallback({
      SetEvent: async (value: string) => {
        const { event, info } = parseQueryString(value);

        const data = await asyncReduce(
          this.instances,
          async (prev, cur) => {
            if (prev !== info) return prev;

            if (typeof cur.eventsHandler === 'function') {
              return cur.eventsHandler(event, info);
            }

            return info;
          },
          info
        );

        if (Array.isArray(this.callbacks[event])) {
          this.callbacks[event].forEach((callback) => {
            if (typeof callback === 'function') {
              callback(decodeURIComponent(data));
            }
          });
        }
      },
      AppOnEvent: async (eventName: string, ...args: string[]) => {
        const data = await asyncReduce(this.instances, async (prev, cur) => {
          if (typeof cur.eventsHandler === 'function') {
            return cur.eventsHandler(event, ...args);
          }

          return prev;
        });

        if (Array.isArray(this.callbacks[eventName])) {
          this.callbacks[eventName].forEach((callback) => {
            if (typeof callback === 'function') {
              const value = data ? [data] : args;
              callback(...value);
            }
          });
        }
      },
    });
  }

  // emitEvent(eventName: string, result: string) {
  //   if (eventCallbacks.hasOwnProperty(eventName)) {
  //     eventCallbacks[eventName](result);
  //   }

  //   if (this.xjs.remote && this.xjs.isProxy()) {
  //     this.xjs.remote.proxy.emitEvent(eventName, result);
  //   }
  // }

  on(eventName: string, callback: CallbackFunction): void {
    // if (this.xjs.isRemote()) {
    //   this.xjs.remote.remote.registerEvent(eventName, callback);
    //   return;
    // }
    this.callbacks[eventName] = this.callbacks[eventName]
      ? [...this.callbacks[eventName], callback]
      : [callback];
  }

  off(eventName: string): void {
    // if (this.xjs.isRemote()) {
    //   this.xjs.remote.remote.unregisterEvent(eventName);
    //   return;
    // }

    delete this.callbacks[eventName];
  }
}
