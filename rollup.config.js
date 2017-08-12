import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import babelrc from 'babelrc-rollup';

const pkg = require('./package.json');

const peer = Object.keys(pkg.peerDependencies);

export default {
    entry: 'src/dayz.jsx',
    plugins: [
        babel(babelrc({ addModuleOptions: false })),
        resolve({
            extensions: ['.js', '.jsx'],
        }),
    ],
    external: [...peer],
    globals: {
        'react': 'React',
        'prop-types': 'PropTypes',
        'moment': 'moment',
        'moment-range': 'momentRange',
        'react-dom': 'reactDOM',
    },
    targets: [
        {
            dest: pkg.main,
            format: 'umd',
            moduleName: 'dayz',
            sourceMap: true,
        },
        {
            dest: pkg.module,
            format: 'es',
            sourceMap: true,
        },
    ],
};
