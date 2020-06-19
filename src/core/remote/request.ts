import { stringify } from 'helpers';
import {
  AsyncId,
  CallbackHandler,
  IRequestResult,
  ICreateRequest,
} from './types';

export const ASYNC_CALLBACK_TIMEOUT = 60000;

class RequestHandler {
  protected _asyncId = 0;
  protected _callbacks: CallbackHandler = {};

  private getAsyncId() {
    return this._asyncId++;
  }

  register(message: ICreateRequest, sender: Function) {
    return new Promise((resolve, reject) => {
      const asyncId = this.getAsyncId();

      sender(
        stringify({
          asyncId,
          ...message,
        })
      );

      const asyncCallbackTimeout = setTimeout(() => {
        delete this._callbacks[asyncId]; // callback clean up

        reject(new Error(`${message.fn} failed. Timeout error`));
      }, ASYNC_CALLBACK_TIMEOUT);

      this._callbacks[asyncId] = {
        callback: resolve,
        clean: () => {
          clearTimeout(asyncCallbackTimeout);
          delete this._callbacks[asyncId];
        },
      };
    });
  }

  private isCallbackExisting(asyncId: AsyncId) {
    return this._callbacks.hasOwnProperty(asyncId);
  }

  runCallback({ asyncId, result }: IRequestResult) {
    if (this.isCallbackExisting(asyncId)) {
      const { callback, clean } = this._callbacks[asyncId];
      callback(result);
      clean();
    }
  }
}

export default new RequestHandler();
