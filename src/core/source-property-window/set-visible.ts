export default function setVisible(isVisible: boolean) {
  const payload = {
    event: 'show-overlay',
    value: !isVisible,
  };

  window.parent.postMessage(JSON.stringify(payload), '*');
}
