export default function sendToPlugin(key: string, payload: unknown): void {
  // Do nothing if called in NodeJS
  if (typeof window === 'undefined') return;

  // @HACK: typescript does not like to play with overriding default definitions
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const external = window.external as any;
  external.CallInner(
    'OnPropsMessageReceive',
    JSON.stringify({
      key,
      payload,
    })
  );
}
