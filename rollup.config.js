import babel from 'rollup-plugin-babel';

const pkg = require('./package.json');

const external = ['react', 'prop-types', 'moment', 'moment-range', 'react-dom'];

const plugins = [
    babel({ exclude: 'node_modules/**' }),
];

const globals = {
    react: 'React',
    moment: 'moment',
    'react-dom': 'ReactDOM',
    'moment-range': 'moment-range',
    'prop-types': 'PropTypes',
};

const input = 'src/dayz.js';

export default [
    {
        input,
        plugins,
        external,
        output: {
            format: 'umd',
            name: 'dayz',
            file: pkg.browser,
            sourceMap: true,
            globals,
        },
    }, {
        input,
        plugins,
        external,
        output: {
            format: 'es',
            sourceMap: true,
            file: pkg.module,
            globals,
        },
    },
];
