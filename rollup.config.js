import typescript from 'rollup-plugin-typescript';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import builtins from 'rollup-plugin-node-builtins';
import { terser } from 'rollup-plugin-terser';

export default {
  input: 'tools/umd.entry.ts',
  plugins: [
    builtins(),
    typescript(),
    resolve({
      browser: true,
    }),
    commonjs(),
    terser(),
  ],
  output: {
    file: 'dist/xjs.umd.js',
    name: 'Xjs',
    format: 'umd',
    exports: 'default',
  },
};
