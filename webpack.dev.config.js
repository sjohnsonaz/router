module.exports = {
    mode: 'development',
    entry: {
        'router': './src/scripts/router.ts',
        'mochaRunner': './src/mocha/BrowserRunner.ts'
    },
    output: {
        filename: './bundle/[name].js',
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
