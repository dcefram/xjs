export enum MODES {
  FULL = 'full',
  TABBED = 'embedded',
}

export default function setMode(mode: string = 'embedded') {
  if (typeof window === 'undefined') return;

  const payload = {
    event: 'set-mode',
    value: mode,
  };

  window.parent.postMessage(JSON.stringify(payload), '*');
}
