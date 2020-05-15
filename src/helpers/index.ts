import isString from 'lodash/isString';

export const stringify = (value: any) =>
  isString(value) ? value : JSON.stringify(value);

export const parse = (value: any) =>
  isString(value) ? JSON.parse(value) : value;

export const noop = () => {};
