import babel from 'rollup-plugin-babel';

const pkg = require('./package.json');

const external = ['react', 'prop-types'];

const plugins = [
    babel({
        babelrc: true,
        exclude: 'node_modules/**',
        presets: [['es2015', { modules: false }], 'react', 'es2015-rollup'],
        plugins: [],
    }),
];

const globals = {
    react: 'React',
    invariant: 'invariant',
    'prop-types': 'PropTypes',
};

const input = 'src/dayz.jsx';

export default [
    {
        input,
        plugins,
        external,
        output: {
            format: 'umd',
            name: 'dayz',
            sourceMap: true,
            file: pkg.browser,
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
