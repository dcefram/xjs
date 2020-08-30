export default function setVisible(isVisible: boolean): void {
  if (typeof window === 'undefined') return;

  const payload = {
    event: 'show-overlay',
    value: !isVisible,
  };

  window.parent.postMessage(JSON.stringify(payload), '*');
}
