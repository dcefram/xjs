import parser from 'fast-xml-parser';

import Xjs from 'core/xjs';
import Internal from 'internal/internal';
import Environment from 'helpers/environment';
import {
  IBroadcastChannelList,
  IBroadcastChannelDetails,
  IChannelName,
  IGeneratedInterface,
  IBandwidthUsage,
} from './types';

/**
 * The Output class provides methods to interact with the stream and recording functionality
 * of XSplit.
 *
 * @remarks
 *
 * This class includes methods to start/stop broadcasting to a service or a local recording,
 * and also includes helper methods to get the relevant stream details.
 *
 * That said, the output "instance" DOES NOT represent a specific broadcast service. An output
 * instance represents an interface to query information to the target XSplit application.
 *
 * @example
 *
 * ```ts
 * import Xjs, { XjsTypes } from '@xjsframework/xjs';
 * import Output from '@xjsframework/xjs/core/output';
 * import { send } from './ws';
 *
 * const xjs = new Xjs({ type: XjsTypes.Remote, sendMessage: send });
 * const output = new Output(xjs);
 *
 * output.getServices().then(console.log); // ['Local Recording', ...]
 * ```
 */
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

  /**
   * Returns the list of available services.
   *
   * @returns A promise that resolves a list of strings that represent the available services' names
   */
  async getServices(): Promise<string[]> {
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

  /**
   * Returns the list of currently active services.
   *
   * @returns A promise that resolves a list of strings that represent the currently active services' names
   */
  async getActiveServices(): Promise<string[]> {
    const recStatXml: string = await this.internal.exec(
      'AppGetPropertyAsync',
      'recstat'
    );
    const recStatParsed: IGeneratedInterface = parser.parse(recStatXml, {
      attributeNamePrefix: '',
      ignoreAttributes: false,
    });

    const {
      stat: { channel: channels },
    } = recStatParsed;

    return channels.map((channel) => channel.name);
  }

  /**
   * @TODO: I don't know what's this for yet... I mean, we know what the `channel` name is at this point, so what's the point of getting the `displayName`?
   */
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

  /**
   * Get the frames dropped of the specified channel
   *
   * @param channel - The service name
   * @returns A promise that resolves with the number of frames dropped
   */
  async getStreamDrops(channel: string): Promise<number> {
    const streamDrops: string = await this.internal.exec(
      'AppGetProperty',
      `streamdrops:${channel}`
    );
    const [drops] = streamDrops.split(',');

    return Number(drops) || 0;
  }

  /**
   * Get the GOP frames dropped of the specified channel
   *
   * @param channel - The service name
   * @returns A promise that resolves with the number of GOP frames dropped
   */
  async getGOPDrops(channel: string): Promise<number> {
    const bandwidthUsage: string = await this.internal.exec(
      'GetGlobalProperty',
      'bandwidthusage-all'
    );
    const usage: IBandwidthUsage[] = JSON.parse(bandwidthUsage);

    for (const entry of usage) {
      if (entry.ChannelName === channel) {
        return Number(entry.Dropped);
      }
    }

    return 0;
  }

  /**
   * Get the frames rendered of the specified channel
   *
   * @param channel - The service name
   * @returns A promise that resolves with the number of frames rendered
   */
  async getStreamRenderedFrames(channel: string): Promise<number> {
    const streamDrops: string = await this.internal.exec(
      'AppGetProperty',
      `streamdrops:${channel}`
    );
    const [, rendered] = streamDrops.split(',');

    return Number(rendered) || 0;
  }

  /**
   * Gets the current duration of the specified stream channel
   *
   * @param channel - The service name
   * @returns A promise that resolves with the duration of the stream in microseconds
   */
  async getStreamTime(channel: string): Promise<number> {
    const streamTime: string = await this.internal.exec(
      'AppGetProperty',
      `streamtime:${channel}`
    );
    const duration: number = Number(streamTime) / 10;
    return duration;
  }

  /**
   * Get the bandwidth usage of the specified stream
   *
   * @param channel - The service name
   * @returns A promise that resolves with the bandwidth usage
   */
  async getBandwidthUsage(channel: string): Promise<number> {
    const bandwidthUsage: string = await this.internal.exec(
      'GetGlobalProperty',
      'bandwidthusage-all'
    );
    const usage: IBandwidthUsage[] = JSON.parse(bandwidthUsage);

    for (const entry of usage) {
      if (entry.ChannelName === channel) {
        return Number(entry.AvgBitrate);
      }
    }

    return 0;
  }

  /**
   * Start broadcasting to a specific service.
   *
   * @remarks
   *
   * This method is also used to start local recording. Just pass in 'Local Recording' to start recording.
   *
   * @param channel - The service name
   * @returns A promise that resolves a boolean flag that denotes if the broadcast successfully started or not
   */
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

  /**
   * Stop broadcasting a specific active broadcast.
   *
   * @param channel - The service name
   * @returns A promise that resolves a boolean flag, with `true` if the broadcast successfully stopped, or `false` if it failed.
   */
  async stopBroadcast(channel: string): Promise<boolean> {
    const result = await this.internal.exec(
      'CallHostFunc',
      'stopBroadcast',
      channel
    );

    return result === '1';
  }

  /**
   * Pause local recording
   *
   * @remarks
   *
   * Although it is possible to pass a stream service name, the pause functionality only works for local recordings.
   * For live streams, this promise would simply resolve a boolean `false` flag.
   *
   * @param channel - The service name
   * @returns A promise that resolves a boolean flag, with `true` if the broadcast successfully paused, or `false` if it failed.
   */
  async pauseBroadcast(channel: string): Promise<boolean> {
    const result = await this.internal.exec('CallHostFunc', channel);
    return result === '1';
  }

  /**
   * Resume a paused local recording
   *
   * @remarks
   *
   * Although it is possible to pass a stream service name, the resume functionality only works for local recordings that is currently paused.
   * For live streams, this promise would simply resolve a boolean `false` flag.
   *
   * @param channel - The service name
   * @returns A promise that resolves a boolean flag, with `true` if the broadcast successfully resumed, or `false` if it failed.
   */
  async resumeBroadcast(channel: string): Promise<boolean> {
    const result = await this.internal.exec('CallHostFunc', channel);
    return result === '1';
  }
}

export default Output;
