var ExtractTextPlugin = require('extract-text-webpack-plugin');

var config = require('./webpack.config');

config.entry = ['./test/view.scss','./test/test-component.jsx'];

config.output = {
    path:  'dist',
    publicPath: '/dist/',
    filename: 'dayz-demo.js',
    libraryTarget: 'umd',
    umdNamedDefine: true,
    library: 'DayzTestComponent'
};

config.exernals = {
    'react': 'React',
    'react-dom': 'ReactDOM'
};

config.plugins = [
    new ExtractTextPlugin("dayz-demo.css")
];

module.exports = config;
