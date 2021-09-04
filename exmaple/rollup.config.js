import html from '@rollup/plugin-html'
import commonjs from '@rollup/plugin-commonjs'
import { babel } from '@rollup/plugin-babel'

module.exports = {
  input: 'src/index.js',
  output: {
    dir: 'build',
    format: 'iife'
  },
  plugins: [commonjs(), babel({ babelHelpers: 'bundled', exclude: 'node_modules' }), html()]
}