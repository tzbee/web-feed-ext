const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

const OUTPUT_PATH = path.resolve(__dirname, 'dist');

module.exports = {
    entry: {
        popup: './src/popup/popup.js',
        background: './src/background/background.js'
    },
    output: {
        path: OUTPUT_PATH,
        chunkFilename: '[name].bundle.js',
        filename: '[name]/[name].js'
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                loader: 'babel-loader'
            },
            {
                test: /\.(jpe?g|gif|png|svg(\?v=\d+\.\d+\.\d+)?|woff(\?v=\d+\.\d+\.\d+)?|woff2(\?v=\d+\.\d+\.\d+)?|ttf(\?v=\d+\.\d+\.\d+)?|wav|mp3|eot(\?v=\d+\.\d+\.\d+)?)$/,
                loader: 'file-loader',
                options: {
                    name: '/img/[name].[ext]',
                    publicPath: '/dist'
                }
            },
            {
                test: /\.scss$/,
                loaders: ['style-loader', 'css-loader', 'sass-loader']
            },
            {
                test: /\.css$/,
                loaders: ['style-loader', 'css-loader']
            }
        ]
    },
    stats: {
        colors: true
    },
    devtool: 'source-map',
    plugins: [
        new CopyWebpackPlugin([
            { from: 'src/popup/popup.html', to: 'popup/popup.html' },
            { from: 'src/img', to: 'img/' }
        ]),
        new CleanWebpackPlugin([OUTPUT_PATH])
    ]
};
