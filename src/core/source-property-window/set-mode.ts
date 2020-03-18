export enum MODES {
  FULL = 'full',
  TABBED = 'embedded',
}

export default function setMode(mode: string = "embedded") {
  const payload = {
    event: 'set-mode',
    value: mode,
  };

  window.parent.postMessage(JSON.stringify(payload), '*');
}
