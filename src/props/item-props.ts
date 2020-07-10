import { InvalidParamError, ReadOnlyError } from 'internal/errors';
import hasRequiredKeys from 'helpers/has-required-keys';

type KeyValuePair = {
  [key: string]: unknown;
};

type Position = {
  left: number;
  top: number;
  right: number;
  bottom: number;
};

const ItemProps = {
  keepAspectRatio: {
    key: 'prop:keep_ar',
    setValidator: (value: boolean): boolean => {
      if (typeof value !== 'boolean') {
        throw new InvalidParamError(`${value} should be a boolean`);
      }

      return true;
    },
    setTransformer: (value: boolean): string => (value ? '1' : '0'),
    getTransformer: (value: string): boolean => value === '1',
  },

  transparency: {
    key: 'prop:alpha',
    setValidator: (value: number): boolean => {
      if (typeof value !== 'number') {
        throw new InvalidParamError(`${value} should be a number`);
      }

      if (value < 0 || value > 255) {
        throw new Error('Transparency may only be in the range 0-255.');
      }

      return true;
    },
    setTransformer: (value: number): string => String(value),
    getTransformer: (value: string): number => parseInt(value),
  },

  browser60fps: {
    key: 'prop:Browser60fps',
    setValidator: (value: boolean): boolean => {
      if (typeof value !== 'boolean') {
        throw new InvalidParamError(`${value} should be a boolean`);
      }

      return true;
    },
    setTransformer: (value: boolean): string => (value ? '1' : '0'),
    getTransformer: (value: string): boolean => value === '1',
  },

  customName: {
    key: 'prop:cname',
    setValidator: (name: string): boolean => {
      if (typeof name !== 'string') {
        throw new InvalidParamError(`${name} should be a string`);
      }

      return true;
    },
  },

  position: {
    key: 'prop:pos',
    setValidator: (pos: Position): boolean => {
      const [isValidParam, missingKeys] = hasRequiredKeys(pos, [
        'left',
        'top',
        'right',
        'bottom',
      ]);

      if (isValidParam) {
        throw new InvalidParamError(`Missing keys: ${missingKeys.join(', ')}`);
      }

      return true;
    },
    setTransformer: (pos: Position): string => {
      const parsed = Object.keys(pos).reduce(
        (stack: KeyValuePair, key: string) => {
          const decimal = Number(pos[key]) / 100;

          return {
            ...stack,
            [key]: Math.min(Math.max(0, decimal), 1).toFixed(1),
          };
        },
        {}
      );

      return `${parsed.left},${parsed.top},${parsed.right},${parsed.bottom}`;
    },
    getTransformer: (value: string): Position => {
      const posArray = String(value).split(',');
      const order = ['left', 'top', 'right', 'bottom'];

      // Convert them to percents??
      return posArray.reduce((stack: Position, pos: string, index: number) => {
        return {
          ...stack,
          [order[index]]: Number(pos) * 100,
        };
      }, {} as Position);
    },
  },

  visibility: {
    key: 'prop:visible',
    setValidator: (isVisible: boolean): boolean => {
      if (isVisible) {
        throw new InvalidParamError(`${isVisible} should be a boolean`);
      }

      return true;
    },
    setTransformer: (isVisible: boolean): string => (isVisible ? '1' : '0'),
    getTransformer: (isVisible: string): boolean => isVisible === '1',
  },

  item: {
    key: 'prop:item',
  },

  srcid: {
    key: 'prop:srcid',
  },

  type: {
    key: 'prop:type',
    setValidator: (params: { type: string; item: string }): boolean => {
      const [isValidParam, missingKeys] = hasRequiredKeys(params, [
        'type',
        'item',
      ]);

      if (isValidParam) {
        throw new InvalidParamError(`Missing keys: ${missingKeys.join(', ')}`);
      }

      return true;
    },
    setTransformer: (params: { type: string; item: string }): string =>
      `${params.type},${params.item}`,
    getTransformer: (type: string): string => {
      // @TODO: Should we just return strings???
      const types = {
        0x0: 'undefined',
        0x1: 'file',
        0x2: 'live',
        0x3: 'text',
        0x4: 'bitmap',
        0x5: 'screen',
        0x6: 'flash',
        0x7: 'games',
        0x8: 'html',
        0x9: '3ds',
        0xa: 'ppt',
        0xb: 'scene',
        0xc: 'group',
        0xd: 'replay',
      };

      return types[type];
    },
  },

  itemList: {
    key: 'itemlist',
    setValidator: (): void => {
      throw new ReadOnlyError('Setting itemlist is not supported');
    },
    setTransformer: (): void => {
      throw new ReadOnlyError('Setting itemlist is not supported');
    },
    getTransformer: (value: string): string[] => String(value).split(','),
  },

  fileInfo: {
    key: 'FileInfo',
    setValidator: (): void => {
      throw new ReadOnlyError('Setting FileInfo is not supported');
    },
  },
};

export default ItemProps;
