import isString from 'lodash-es/isString';

export const stringify = (value: unknown): string =>
  isString(value) ? value : JSON.stringify(value);

export const parse = (value: string): unknown =>
  isString(value) ? JSON.parse(value) : value;
