var webpack = require('webpack');
var ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
    entry: {
        app: './src/app/app.js',
        vendor: ["riot", "riotcontrol", "lodash"]
    },
    output: {
        path: __dirname + '/dist',
        filename: 'bundle.js'
    },
    devtool: 'source-map',
    plugins: [

        // Includes riot in build for compiling .tag files
        new webpack.ProvidePlugin({ riot: 'riot' }),

        // Creates a vendor.js bundle
        new webpack.optimize.CommonsChunkPlugin("vendor", "vendor.bundle.js"),

        new ExtractTextPlugin("styles.css")
    ],
    module: {
        preLoaders: [
            { test: /\.tag$/, exclude: /node_modules/, loader: 'riotjs-loader', query: { type: 'none' } }
        ],
        loaders: [
            { test: /\.scss$/, loader: ExtractTextPlugin.extract(
                // activate source maps via loader query
                'css?sourceMap!' +
                'sass?sourceMap'
            ) },
            // TODO Do we want .woff fonts?
            { test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "url-loader?limit=10000&minetype=application/font-woff" },
            { test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "file-loader" }
        ]
    }

};
