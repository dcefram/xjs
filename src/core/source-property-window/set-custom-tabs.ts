export default function setCustomTabs(tabs: string[]) {
  const payload = {
    event: 'set-custom-tabs',
    value: JSON.stringify(tabs),
  };

  window.parent.postMessage(JSON.stringify(payload), '*');
}
