// Note: Ideally, I'd prefer to modify the underlying functions that does the talking with the core
// and "tunnel" the data accordingly (ie. if local, send to core, if remote, send to messenger). This
// would've made this class clear of logic that the remote or proxy class "should" be responsible.
//
// unfortunately though, due to the requirement of auto-processing data in the proxy side, we'd
// need to settle down with modifying Events class directly.

import Xjs from 'core/xjs';
import { XjsTypes } from 'core/xjs/types';
import { Remote } from 'core/remote';

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

    if (
      this.xjs.type === XjsTypes.Remote &&
      this.xjs.internal instanceof Remote
    ) {
      // Send a message to Proxy, tell Proxy what "instances" to load.
      const instanceNames = instances?.map((i) => i.name) || [];

      this.xjs.internal.send(
        'register-event',
        () => {
          // @TODO: Do we need to listen for register-event's response?
        },
        ...instanceNames
      );
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
    if (
      this.xjs.type === XjsTypes.Remote &&
      this.xjs.internal instanceof Remote &&
      typeof this.callbacks[eventName] === 'undefined'
    ) {
      this.xjs.internal.send('listen-event', (result: string) => {
        const { event: eventName, data } = JSON.parse(result);

        if (Array.isArray(this.callbacks[eventName])) {
          this.callbacks[eventName].forEach((cb) => {
            if (typeof cb === 'function') {
              cb(...data);
            }
          });
        }
      });
    }

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
