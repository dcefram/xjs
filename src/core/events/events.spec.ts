import Events from './events';
import Xjs from 'core/xjs';
jest.mock('../xjs');

describe('Events', () => {
  let events;

  beforeAll(() => {
    const xjs = new Xjs();
    events = new Events(xjs);
  });

  describe('on', function () {
    it('should add a listener', function (done) {
      events.on('SceneChange', (arg) => {
        expect(arg).toBe('testing');
        done();
      });

      window.AppOnEvent('testing');
    });
  });

  // describe('off', function () {
  //   it('should remove a listener', function () {
  //     // @TODO
  //   });
  // });
});
