import Xjs from 'core/xjs';
import { XjsTypes } from 'core/xjs/types';

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

    if (this.xjs.type === XjsTypes.Remote) {
      // Send a message to Proxy, tell Proxy what "instances" to load.
      // const instanceNames = instances?.map((i) => i.name) || [];
      return;
    }

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

  on(eventName: string, callback: CallbackFunction): void {
    if (Array.isArray(this.callbacks[eventName])) {
      this.callbacks[eventName].push(callback);
    } else {
      this.callbacks[eventName] = [callback];
    }
  }

  off(eventName: string, callback: CallbackFunction): void {
    const index = this.callbacks[eventName]?.indexOf(callback) || -1;

    if (index > -1) {
      this.callbacks[eventName].splice(index, 1);
    }
  }
}
