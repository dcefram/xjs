/**
 * Check if an object has the required set of keys.
 *
 * @param obj Object to inspect
 * @param requiredKeys Required set of keys
 * @returns A tuple that contains the boolean flag if it has the required keys or not, and an array of keys that were missing
 */
export default function hasRequiredKeys(
  obj: unknown,
  requiredKeys: string[]
): [boolean, string[]] {
  if (typeof obj !== 'object') {
    return [false, requiredKeys];
  }

  const paramKeys = Object.keys(obj);
  const missingKeys: string[] = requiredKeys.filter(
    (key: string) => paramKeys.indexOf(key) === -1
  );

  if (missingKeys.length > 0) {
    return [false, missingKeys];
  }

  return [true, []];
}
