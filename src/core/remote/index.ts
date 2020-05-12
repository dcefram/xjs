import Xjs from 'core/xjs';
import request from './request';
import { RequestResult, RemoteRequest, ProxyRequest } from './types';
import { parse, stringify } from 'helpers';

export default class Remote {
  private sender: Function;

  private xjs: Xjs;

  constructor(xjs) {
    this.xjs = xjs;
  }

  setSender(sender) {
    this.sender = sender;
  }

  // used only by remote
  send(message: RemoteRequest): Promise<any> {
    return request.register(message, this.sender);
  }

  receiveMessage(message) {
    const result = parse(message);

    if (this.xjs.isRemote()) {
      return request.runCallback(result as RequestResult);
    }

    // proxy
    this.processRequest(result);
  }

  async processRequest({ asyncId, fn, args }: ProxyRequest) {
    const result = await this.xjs._internal.exec(fn, ...args);

    this.sender(
      stringify({
        asyncId,
        result,
      })
    );
  }
}
