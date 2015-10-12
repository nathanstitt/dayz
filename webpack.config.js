var ExtractTextPlugin = require('extract-text-webpack-plugin');

var isProduction = process.env['NODE_ENV'] === 'production';

module.exports = {
    cache: {},
    devtool: isProduction ? undefined : 'source-map',
    entry: [
        './style/dayz.scss',
        (isProduction ? './src/dayz.jsx' : './src/view.js')
    ],
    output: {
        path: isProduction ? 'dist' : 'dist/',
        publicPath: isProduction ? '' : '/dist/',
        filename: 'dayz.js'
    },
    plugins: [ new ExtractTextPlugin('dayz.css') ],
    module: {
        loaders: [
            { test: /\.jsx?$/, query: {optional: ['runtime'], stage: 0},
              exclude: [/node_modules/],
              loader: 'babel-loader' },
            { test: /\.scss$/,
              loaders: ["style", "css", "sass"] }
        ]
    },
    resolve: {
        extensions: ['', '.js', '.jsx']
    },
    devServer: {
        contentBase: './',
        host: 'localhost',
        inline: true,
        host: 'localhost',
        outputPath: '/',
        filename: '[name].js',
        quiet: false,
        noInfo: false,
        hot: true,
        stats: {
            assets: false,
            colors: true,
            version: false,
            hash: false,
            timings: false,
            chunks: false,
            chunkModules: false
        }

    }
};
