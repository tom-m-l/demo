const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require("terser-webpack-plugin");
const HtmlWebpackInlineSourcePlugin = require('./html-webpack-inline-source-plugin');

const isProduction = process.env.NODE_ENV == 'production';

module.exports = {
    entry: {
        index: './src/index.ts'
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, '../dist')
    },
    resolve: {
        // Add `.ts` and `.tsx` as a resolvable extension.
        extensions: [".ts", ".tsx", ".js"]
    },
    module: {
        rules: [
            // all files with a `.ts` or `.tsx` extension will be handled by `ts-loader`
            {
                test: /\.ts?$/,
                use: ['ts-loader']
            },
            {
                test: /\.scss$/,
                use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader']
            },
            {
                test: /\.(png|jpe?g|gif)$/i,
                use: {
                    loader: 'file-loader',
                    options: {
                        outputPath(url, resourcePath, context) {// 指定图片输入的文件夹

                            if (/temp/.test(resourcePath)) {

                                return `temp/${url}`;

                            }

                            return `images/${url}`;

                        },
                        publicPath(url, resourcePath, context) {// 指定获取图片的路径

                            if (/temp/.test(resourcePath)) {

                                return `temp/${url}`;

                            }

                            return `images/${url}`;

                        },
                        name: '[name].[ext]' // 输入的图片名
                    }
                }
            },
            {
                test: /\.html$/i,
                loader: 'html-loader',
                options: {
                    attributes: {
                        list: [
                            {
                                tag: 'img',
                                attribute: 'src',
                                type: 'src',
                            },
                            {
                                tag: 'img',
                                attribute: 'lazy-src',
                                type: 'src',
                            }
                        ]
                    },
                    minimize: false
                }

            }
        ]
    },
    plugins: [
        new CleanWebpackPlugin(),
        new MiniCssExtractPlugin(),
        new HtmlWebpackPlugin(Object.assign(
            {
                filename: 'index.html',
                template: 'src/index.html',
                defineMode: process.env.NODE_ENV,
                minify: {
                    collapseWhitespace: true,
                    removeComments: true,
                }
            },
            isProduction ? {
                inlineSource: '.(js|css)$'
            } : {}
        )),

        isProduction ? new HtmlWebpackInlineSourcePlugin() : function () { },
    ],
    optimization: {
        minimize: isProduction,
        minimizer: [
            new TerserPlugin()
        ],
    },
    performance: {
        hints: false,
    },
};