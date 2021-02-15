import Remote from './remote';
import { IMessenger, IProxyMessage, IRemoteMessage } from './types';

jest.setTimeout(10000);
jest.useFakeTimers();

let mockCallback;
const mockCaller = (message: IRemoteMessage | IProxyMessage) => {
  if (typeof mockCallback === 'function') {
    mockCallback(message);
  }
};
const mockSender = jest.fn();

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

describe('Remote', () => {
  const remote = new Remote({
    messenger: mockMessenger,
  });

  describe('exec', () => {
    afterEach(() => {
      jest.clearAllTimers();
    });

    it('should send the payload the send interface', () => {
      remote.exec('AppGetProperty', 'sceneconfig');
      expect(mockSender).toHaveBeenCalled();
    });

    it('should reject when the request took more than 10 seconds to reply', async () => {
      expect.assertions(2);

      try {
        const promise = remote.exec('AppGetProperty', 'sceneconfig');

        expect(setTimeout).toHaveBeenCalledWith(expect.any(Function), 10000);

        jest.runAllTimers();

        await promise;
      } catch (error) {
        expect(error).toEqual('Exec timeout. Execution exceeded 10 seconds.');
      }
    });

    it('should resolve the promise if we got some data back from proxy', async () => {
      const promise = remote.exec('AppGetProperty', 'sceneconfig');

      mockCaller({
        type: 'proxy',
        proxyId: 'proxy-id',
        remoteId: remote.remoteId,
        asyncId: 3,
        result: '<configuration />',
      });

      const data = await promise;

      expect(data).toEqual('<configuration />');
    });

    it('should reject when the replies does not have the expected remote ID', async () => {
      try {
        const promise = remote.exec('AppGetProperty', 'sceneconfig');

        mockCaller({
          type: 'proxy',
          proxyId: 'proxy-id',
          remoteId: 'remote-id',
          asyncId: 4,
          result: '<configuration />',
        });

        jest.runAllTimers();

        await promise;
      } catch (error) {
        expect(error).toEqual('Exec timeout. Execution exceeded 10 seconds.');
      }
    });
  });

  describe('send', () => {
    it('should send the payload to the send interface', () => {
      remote.send('AppGetProperty');
      expect(mockSender).toHaveBeenCalled();
    });
  });
});
