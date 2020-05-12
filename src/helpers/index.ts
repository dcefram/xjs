import isObject from 'lodash/isObject';
import isFunction from 'lodash/isFunction';
import isString from 'lodash/isString';
import isNumber from 'lodash/isNumber';
import isArray from 'lodash/isArray';

export { isFunction, isNumber, isString, isObject };

export const stringify = (value: any) => {
  if (isString(value)) {
    return value;
  }

  try {
    JSON.stringify(value);
  } catch (e) {
    throw new Error(e);
  }
};

export const parse = (value: any) => {
  if (isString(value)) {
    try {
      return JSON.parse(value);
    } catch (e) {
      throw new Error('Incorrect format');
    }
  }

  if (isObject(value) || isArray(value)) {
    return value;
  }

  return value;
};

export const noop = () => {};
