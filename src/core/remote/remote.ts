import { XjsTypes } from '../xjs/types';
import request from './request';
import { RequestResult, RemoteRequest, ProxyRequest } from './types';
import { parse, stringify } from '../../helpers';

export default class Remote {
  private sender: Function;

  private type: XjsTypes;
  private exec: Function;

  constructor({ type, exec }) {
    this.type = type;
    this.exec = exec;
  }

  setSender(sender: Function) {
    this.sender = sender;
  }

  // used only by remote
  send(message: RemoteRequest): Promise<any> {
    return request.register(message, this.sender);
  }

  receiveMessage(message: string) {
    const result = parse(message);

    if (this.isRemote()) {
      return request.runCallback(result as RequestResult);
    }

    // proxy
    this.processRequest(result);
  }

  async processRequest({ asyncId, fn, args }: ProxyRequest) {
    const result = await this.exec(fn, ...args);

    this.sender(
      stringify({
        asyncId,
        result,
      })
    );
  }

  private isRemote() {
    return this.type === XjsTypes.Remote;
  }
}
