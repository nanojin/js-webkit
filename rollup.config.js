import typescript from '@rollup/plugin-typescript';

export default {
  input: 'src/index.ts',
  output: {
    file: 'dist/webkit-lib.user.js',
    format: 'iife',
    name: 'WebKitLib',
  },
  plugins: [typescript()],
};
