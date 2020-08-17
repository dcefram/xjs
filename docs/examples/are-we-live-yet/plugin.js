const output = document.getElementById('output');
const xjs = new window.Xjs();
const events = new window.Xjs.Events(xjs);

events.on('StreamStart', () => {
  output.textContent = 'Yes we are!';
  output.classList.add('yes');
});

events.on('StreamEnd', () => {
  output.textContent = 'No, not quite';
  output.classList.remove('yes');
});
