const callbacks = {};

if (
  typeof window !== 'undefined' &&
  typeof window.OnPropsMessageReceive === 'undefined'
) {
  window.OnPropsMessageReceive = (message: string) => {
    try {
      const { key, payload } = JSON.parse(message);

      if (typeof callbacks[key] === 'undefined') return;

      callbacks[key].forEach((cb) => {
        if (typeof cb !== 'function') return;

        cb(payload);
      });
    } catch (error) {
      console.error('OnPropsMessageReceive is invalid', error.message);
    }
  };
}

export const off = (key: string, cb: unknown): void => {
  if (typeof callbacks[key] === 'undefined') {
    return;
  }

  const index = callbacks[key].indexOf(cb);

  if (index !== -1) {
    delete callbacks[key][index];
  }
};

export default function (key: string, cb: unknown): void {
  if (typeof callbacks[key] === 'undefined') {
    callbacks[key] = [];
  }

  callbacks[key].push(cb);
}
