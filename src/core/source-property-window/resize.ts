export default function resize(width: number, height: number): void {
  if (typeof window === 'undefined') return;

  const payload = {
    event: 'resize',
    value: JSON.stringify({
      width,
      height,
    }),
  };

  window.parent.postMessage(JSON.stringify(payload), '*');
}
