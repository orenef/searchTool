
module.exports = {
    entry: ['babel-polyfill', './src/index.js'],
    output: {
        path: __dirname +'/dist',
        filename: "bundle.js"
    },
    module: {
        loaders: [
            { test: /\.js$/, exclude: /node_modules/, loader: "babel-loader" },
            { test: /\.css$/, loader: "style-loader!css-loader" },
            {
                test: /\.html$/,
                loader: "file?name=[name].[ext]",
            },

        ],

    }
};