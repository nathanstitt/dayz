module.exports = {
    presets: [
        '@babel/preset-react',
        [
            '@babel/preset-env', {
                targets: {
                    esmodules: true,
                },
            },
        ],
    ],
    plugins: [
        ['@babel/plugin-proposal-class-properties', { loose: true }],
    ],
};
