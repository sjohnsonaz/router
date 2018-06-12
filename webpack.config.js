var webpack = require('webpack');

module.exports = {
    mode: 'production',
    entry: {
        'router': './src/scripts/router.ts'
    },
    output: {
        filename: './bundle/[name].min.js',
        libraryTarget: 'var',
        library: '[name]'
    },
    resolve: {
        extensions: ['.webpack.js', '.web.js', '.ts', '.tsx', '.js']
    },
    externals: {
        mocha: 'mocha',
        chai: 'chai'
    },
    module: {
        rules: [{
            test: /\.tsx?$/,
            use: ['ts-loader']
        }]
    }
};
