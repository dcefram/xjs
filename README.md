> WARNING: This is still very much a work-in-progress!

# XJS Framework

The XSplit JS Framework allows developers to create plugins for XSplit Broadcaster.

This branch is the proposed next version of XJS Framework. Further documentation will be done down the line.

- [API Reference](https://xjs.dcefram.now.sh/)

## Remote

```
import XJS from 'xjs';
import { XjsTypes } from 'xjs/core/xjs/types';

// Establish connection
const Connection = () => {
  return new Promise(resolve => {
    if (RTCPeerConnection !== undefined) {
      const rtc = new RTCPeerConnection();

      rtc.ondatachannel = channel => {
        resolve(channel);
      };

      return;
    }

    const ws = new WebSocket('ws://localhost:9999');

    return resolve(ws);
  });
};

(async () => {
  // PROXY using RTC
  const conn = (await Connection()) as RTCDataChannel;

  conn.addEventListener('open', d => {
    const xjs = new XJS({
      type: XjsTypes.Proxy,
      sendMessage: conn.send.bind(conn),
    });

    conn.addEventListener('message', ({ data: message }) => {
      xjs.remote.receiveMessage(message);
    });
  });
})();

(async () => {
  // PROXY using WebSocket
  const conn = (await Connection()) as WebSocket;

  conn.addEventListener('open', d => {
    const xjs = new XJS({
      type: XjsTypes.Proxy,
      sendMessage: conn.send.bind(conn),
    });

    conn.addEventListener('message', ({ data: message }) => {
      xjs.remote.receiveMessage(message);
    });
  });
})();

(async () => {
  // REMOTE using WebSocket
  const conn = (await Connection()) as RTCDataChannel;

  conn.addEventListener('open', d => {
    const xjs = new XJS({
      type: XjsTypes.Remote,
      sendMessage: conn.send.bind(conn),
    });

    conn.addEventListener('message', ({ data: message }) => {
      xjs.remote.receiveMessage(message);
    });
  });
})();

(async () => {
  // REMOTE using WebSocket
  const conn = (await Connection()) as WebSocket;

  conn.addEventListener('open', d => {
    const xjs = new XJS({
      type: XjsTypes.Remote,
      sendMessage: conn.send.bind(conn),
    });

    conn.addEventListener('message', ({ data: message }) => {
      xjs.remote.receiveMessage(message);
    });
  });
})();

```
