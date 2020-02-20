export default function sendToPlugin(payload: any) {
  // @HACK: typescript does not like to play with overriding default definitions
  (window.external as any).CallInner(
    'OnPropsMessageReceive',
    JSON.stringify({
      type: 'save-config',
      payload,
    })
  );
}
