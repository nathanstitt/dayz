var ExtractTextPlugin = require('extract-text-webpack-plugin');
var path = require('path');

var isProduction = process.env['NODE_ENV'] === 'production';

var config = {
    cache: {},
    devtool: isProduction ? undefined : 'source-map',
    entry:   (isProduction ? ['./style/dayz.scss','./src/dayz.jsx'] : ['./test/view.scss','./test/view.jsx']),
    output: {
        path:  'dist',
        publicPath: isProduction ? '' : '/dist/',
        filename: 'dayz.js',
        libraryTarget: 'umd',
        umdNamedDefine: true,
        library: 'Dayz'
    },

    module: {
        loaders: [
            {
                test: /\.jsx?$/,
                exclude: [/node_modules/], loader: 'babel-loader'
            },
            { test: /\.scss$/, loader: ExtractTextPlugin.extract(
                "style-loader", "css-loader!sass-loader")}
        ]
    },

    plugins: [
        new ExtractTextPlugin("dayz.css")
    ],

    resolve: {
        root: path.resolve(__dirname, 'src'),
        extensions: ['', '.js', '.jsx']
    },

    externals: {},

    devServer: {
        contentBase: './',
        host: 'localhost',
        inline: true,
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
if (isProduction){
    config.externals.react = 'React';
    config.externals.moment = 'moment';
    config.externals['moment-range'] = 'moment.range';
}

module.exports = config;
