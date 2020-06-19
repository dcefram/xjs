export default function sendToPlugin(key: string, payload: any) {
  // Do nothing if called in NodeJS
  if (typeof window === 'undefined') return;

  // @HACK: typescript does not like to play with overriding default definitions
  const external = window.external as any;
  external.CallInner(
    'OnPropsMessageReceive',
    JSON.stringify({
      key,
      payload,
    })
  );
}
