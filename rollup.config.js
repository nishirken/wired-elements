import typescript from '@rollup/plugin-typescript';
import { nodeResolve } from '@rollup/plugin-node-resolve';


export default {
  input: 'src/wired-elements.ts',
  output: {
    dir: 'lib',
    format: 'iife',
    name: 'wiredElements',
  },
  plugins: [
    nodeResolve(),
    typescript(),
  ],
};