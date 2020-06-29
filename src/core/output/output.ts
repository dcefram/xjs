import parser from 'fast-xml-parser';

import Xjs from 'core/xjs';
import Internal from 'internal/internal';
import Environment from 'helpers/environment';
import {
  IBroadcastChannelList,
  IBroadcastChannelDetails,
  IChannelName,
} from './types';

class Output {
  private internal: Internal;

  constructor({ internal }: Xjs) {
    if (Environment.isSourceProps) {
      throw new Error(
        'Source property window does not support output-related functionality'
      );
    }

    this.internal = internal;
  }

  async listServices(): Promise<string[]> {
    const channelListXml: string = await this.internal.exec(
      'CallHostFunc',
      'getBroadcastChannelList'
    );
    const channelListParsed: IBroadcastChannelList = parser.parse(
      channelListXml,
      {
        attributeNamePrefix: '',
        ignoreAttributes: false,
      }
    );

    const channels: IChannelName[] = channelListParsed.channels.channel;

    return channels.map((channel) => decodeURIComponent(channel.name));
  }

  async startBroadcast(channel: string): Promise<boolean> {
    const result = await this.internal.exec(
      'CallHostFunc',
      'startBroadcast',
      channel,
      'suppressPrestreamDialog=1'
    );

    // @TODO:
    return result === '1';
  }

  async stopBroadcast(channel: string): Promise<boolean> {
    const result = await this.internal.exec(
      'CallHostFunc',
      'stopBroadcast',
      channel
    );

    return result === '1';
  }

  async pauseBroadcast(channel: string): Promise<boolean> {
    const result = await this.internal.exec('CallHostFunc', channel);
    return result === '1';
  }

  async resumeBroadcast(channel: string): Promise<boolean> {
    const result = await this.internal.exec('CallHostFunc', channel);
    return result === '1';
  }

  async getDisplayName(channel: string): Promise<string> {
    const channelXml = await this.internal.exec(
      'CallHostFunc',
      'getBroadcastChannelXml',
      channel,
      '0'
    );

    if (!String(channelXml).trim()) {
      console.warn(
        'XJS tried to get the channel details of a nonexistent channel'
      );
      return '';
    }

    const channelParsed: IBroadcastChannelDetails = parser.parse(channelXml, {
      attributeNamePrefix: '',
      ignoreAttributes: false,
    });

    return channelParsed.channel.displayName;
  }
}

export default Output;
