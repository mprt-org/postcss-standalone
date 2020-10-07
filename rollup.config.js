const commonJs = require('@rollup/plugin-commonjs')
const {nodeResolve} = require('@rollup/plugin-node-resolve')
const nodePolyfill = require('rollup-plugin-node-polyfills')

const plugins = [
    new commonJs(),
    new nodeResolve({browser: true}),
    new nodePolyfill(),
]

export default [{
    input: 'src/postcss.js',
    output: {
        file: 'postcss.js',
        format: 'umd',
        name: 'postcss'
    },
    plugins
}, {
    input: 'src/plugins/nested.js',
    output: {
        file: 'plugins/nested.js',
        format: 'umd',
        name: 'postcssNested'
    },
    plugins
}, {
    input: 'src/plugins/modules.js',
    output: {
        file: 'plugins/modules.js',
        format: 'umd',
        name: 'postcssBrowserModules'
    },
    plugins
}]
