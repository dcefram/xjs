export default function setTabsOrder(tabs: string[]) {
  const payload = {
    event: 'set-tab-order',
    value: JSON.stringify(tabs),
  };

  window.parent.postMessage(JSON.stringify(payload), '*');
}
