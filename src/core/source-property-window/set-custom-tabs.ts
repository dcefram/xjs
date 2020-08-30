export default function setCustomTabs(tabs: string[]): void {
  if (typeof window === 'undefined') return;

  const payload = {
    event: 'set-custom-tabs',
    value: JSON.stringify(tabs),
  };

  window.parent.postMessage(JSON.stringify(payload), '*');
}
