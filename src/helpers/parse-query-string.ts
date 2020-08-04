interface KVP {
  [key: string]: string;
}

export default function parseQueryString(query: string): KVP {
  const segments = query.split('&');
  const map = segments.reduce((obj, segment) => {
    const [key, value] = segment.split('=');
    return { ...obj, [key]: value };
  }, {});

  return map;
}
