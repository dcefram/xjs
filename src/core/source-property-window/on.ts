const callbacks = {};

if (typeof window.OnPropsMessageReceive === 'undefined') {
  window.OnPropsMessageReceive = (payload: string) => {
    try {
      const { key, ...props } = JSON.parse(payload);

      if (typeof callbacks[key] === 'undefined') return;

      callbacks[key].forEach(cb => {
        if (typeof cb !== 'function') return;

        cb(props);
      });
    } catch (error) {
      console.error('OnPropsMessageReceive is invalid', error.message);
    }
  };
}

export const off = (key: string, cb: any) => {
  if (typeof callbacks[key] === 'undefined') {
    return;
  }

  const index = callbacks[key].indexOf(cb);

  if (index !== -1) {
    delete callbacks[key][index];
  }
};

export default function(key: string, cb: any) {
  if (typeof callbacks[key] === 'undefined') {
    callbacks[key] = [];
  }

  callbacks[key].push(cb);
}
