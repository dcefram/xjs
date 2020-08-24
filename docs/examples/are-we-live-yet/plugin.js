import Xjs from 'xjs-framework/core/xjs';
import Events from 'xjs-framework/core/events';

const output = document.getElementById('output');
const xjs = new Xjs();
const events = new Events(xjs);

events.on('StreamStart', () => {
  output.textContent = 'Yes we are!';
  output.classList.add('yes');
});

events.on('StreamEnd', () => {
  output.textContent = 'No, not quite';
  output.classList.remove('yes');
});
