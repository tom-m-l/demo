// webpack config
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
    mode: 'development', // 开发模式
    // entry: './src/index.js',
    entry: { // 入口
        index: './src/index.js',
        print: './src/print.js'
    },
    output: { // 出口
        filename: '[name].bundle.js', // 打包后文件
        path: path.resolve(__dirname, 'dist'), // 打包后目录
    },
    plugins: [
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            title: 'Output Management',
        }),
    ],
};