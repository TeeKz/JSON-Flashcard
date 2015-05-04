var webpack = require('webpack');

module.exports = {
    entry: {
        app: './src/app/app.js',
        vendor: ["riot", "riotcontrol", "lodash"]
    },
    output: {
        path: __dirname + '/dist',
        filename: 'bundle.js'
    },
    plugins: [

        // Includes riot in build for compiling .tag files
        new webpack.ProvidePlugin({ riot: 'riot' }),

        // Creates a vendor.js bundle
        new webpack.optimize.CommonsChunkPlugin("vendor", "vendor.bundle.js")
    ],
    module: {
        preLoaders: [
            { test: /\.tag$/, exclude: /node_modules/, loader: 'riotjs-loader', query: { type: 'none' } }
        ],
        loaders: [
            { test: /\.scss$/, loader: "style!css!sass" },
            { test: /\.css$/, loader: "style-loader!css-loader" },
            // TODO Do we want .woff fonts?
            { test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "url-loader?limit=10000&minetype=application/font-woff" },
            { test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "file-loader" }
        ]
    }
};
