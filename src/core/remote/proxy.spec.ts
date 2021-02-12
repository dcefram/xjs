import { mocked } from 'ts-jest/utils';

import Proxy from './proxy';
import { IMessenger, IProxyMessage, IRemoteMessage } from './types';
import Internal from 'internal';

jest.mock('internal');

let mockCallback;
const mockCaller = (message: IRemoteMessage | IProxyMessage) => {
  if (typeof mockCallback === 'function') {
    mockCallback(message);
  }
};
const mockSender = jest.fn();
const mockInternal = mocked(Internal, true);

const mockMessenger: IMessenger = {
  send: (message: IProxyMessage) => {
    // In a real world scenario, we'll be sending the message to a socket server here
    // ex: socket.send(message);
    mockSender(message);
  },
  receive: (cb) => {
    // In a real world scenario, we'll should set some socket listeners here, and pass it to `cb`.
    // ex: socket.on('message', (msg) => msg.type === 'something' ? cb(msg) : null);
    mockCallback = (message: IRemoteMessage) => {
      cb(message);
    };
  },
};

describe('Proxy', () => {
  let proxy;
  beforeEach(() => {
    mockInternal.mockClear();
    proxy = new Proxy({
      messenger: mockMessenger,
    });
  });

  it('should not allow direct access to exec', () => {
    expect(proxy.exec).toThrow();
  });

  it('should be able to receive messages from an external source', () => {
    mockCaller({
      type: 'remote',
      remoteId: 'remote-id',
      asyncId: 0,
      funcName: 'TestFunc',
      args: ['test', 'args'],
    });

    const mockedInstance = mockInternal.mock.instances[0];

    expect(mockedInstance.exec).toHaveBeenCalled();
  });

  it('should ignore messages that is not a remote type', () => {
    mockCaller({
      type: 'proxy',
      proxyId: 'proxy-id',
      remoteId: 'remote-id',
      asyncId: 0,
      result: 'testing',
    });

    const mockedInstance = mockInternal.mock.instances[0];

    expect(mockedInstance.exec).not.toHaveBeenCalled();
  });

  it('should register events if the funcName is register-event', () => {
    mockCaller({
      type: 'remote',
      remoteId: 'remote-id',
      asyncId: 0,
      funcName: 'register-event',
      args: ['Scene'],
    });

    expect(proxy.eventsLoadedInstances).toHaveLength(1);
    expect(proxy.eventsInstance).toBeDefined();
  });

  it('should handle listening to events', (done) => {
    const _proxy = new Proxy({
      messenger: {
        ...mockMessenger,
        send: (message: IProxyMessage) => {
          expect(message).toMatchObject({
            type: 'proxy',
            proxyId: _proxy.proxyId,
            remoteId: 'remote-id',
            asyncId: 0,
            result: JSON.stringify({
              event: 'SceneChange',
              data: ['1'],
            }),
          });
          done();
        },
      },
    });

    mockCaller({
      type: 'remote',
      remoteId: 'remote-id',
      asyncId: 0,
      funcName: 'register-event',
      args: ['Scene'],
    });
    mockCaller({
      type: 'remote',
      remoteId: 'remote-id',
      asyncId: 0,
      funcName: 'listen-event',
      args: ['SceneChange'],
    });

    window.AppOnEvent('SceneChange', '1');
  });
});
