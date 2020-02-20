const callbacks = [];

if (typeof window.OnPropsMessageReceive === 'undefined') {
  window.OnPropsMessageReceive = (payload: string) => {
    callbacks.forEach(cb => {
      if (typeof cb === 'function') {
        try {
          const obj = JSON.parse(payload);

          if (obj.type === 'save-config') {
            cb(obj);
          }
        } catch (error) {
          console.error(error);
        }
      }
    });
  };
}

export const off = (cb: any) => {
  const index = callbacks.indexOf(cb);

  if (index !== -1) {
    delete callbacks[index];
  }
};

export default function(cb: any) {
  callbacks.push(cb);
}
