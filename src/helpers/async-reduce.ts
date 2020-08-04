/* eslint-disable @typescript-eslint/no-explicit-any */

type FnType = (
  previousValue: any,
  currentValue: any,
  index?: number
) => Promise<any>;

export default function asyncReduce(
  list: any[],
  fn: FnType,
  initialValue?: unknown
): Promise<any> {
  return list.reduce(
    (prev, cur, index) =>
      prev.then((previousValue) => fn(previousValue, cur, index)),
    Promise.resolve(initialValue)
  );
}
