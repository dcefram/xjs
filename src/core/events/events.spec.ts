import Events from './events';
import { IEventsHandler } from './types';
import Xjs from 'core/xjs';
jest.mock('../xjs');

describe('Events', () => {
  const xjs = new Xjs();

  describe('on', function () {
    it('should add a listener', function (done) {
      const events = new Events(xjs);
      const callback = (arg) => {
        expect(arg).toBe('testing');
        events.off('SceneChange', callback);
        done();
      };

      events.on('SceneChange', callback);

      window.AppOnEvent('SceneChange', 'testing');
    });

    it('should transform events if handled by an instance handler', function (done) {
      class MockScene implements IEventsHandler {
        eventsHandler(eventName: string, ...args: string[]): string {
          return [eventName, ...args].join('|');
        }
      }

      const scene = new MockScene();
      const events = new Events(xjs, [scene]);
      const callback = (value) => {
        expect(value).toBe('SceneChange|dummy|text');
        events.off('SceneChange', callback);
        done();
      };
      events.on('SceneChange', callback);

      window.AppOnEvent('SceneChange', 'dummy', 'text');
    });

    it('should handle SetEvent callbacks', function (done) {
      const events = new Events(xjs);
      const callback = (value) => {
        expect(value).toBe('testing');
        events.off('SceneChange', callback);
        done();
      };
      events.on('SceneChange', callback);

      window.SetEvent('event=SceneChange&info=testing');
    });

    it('should handle SetEvent callbacks processed by an instance handler', function (done) {
      class MockScene implements IEventsHandler {
        eventsHandler(eventName: string, ...args: string[]): string {
          return [eventName, ...args].join('|');
        }
      }

      const scene = new MockScene();
      const events = new Events(xjs, [scene]);
      const callback = (value) => {
        expect(value).toBe('SceneChange|testing');
        events.off('SceneChange', callback);
        done();
      };
      events.on('SceneChange', callback);

      window.SetEvent('event=SceneChange&info=testing');
    });
  });

  describe('off', function () {
    const events = new Events(xjs);

    it('should remove a listener', function (done) {
      const fail = () => done(new Error('fail'));

      events.on('SceneChange', fail);
      events.off('SceneChange', fail);
      expect(events.callbacks['SceneChange']).toHaveLength(0);

      window.AppOnEvent('SceneChange', 'testing');

      events.on('dummy', () => {
        done();
      });

      window.AppOnEvent('dummy');
    });
  });
});
