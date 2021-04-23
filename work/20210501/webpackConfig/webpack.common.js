const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
// const CopyPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const es3ifyPlugin = require('es3ify-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
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
                use: [MiniCssExtractPlugin.loader,'css-loader','sass-loader']
            },
            {
                test: /\.(png|jpe?g|gif)$/i,
                use: [{
                    loader:'url-loader',
                    options: {
                        limit:false,
                        outputPath: 'images/', // 指定图片输入的文件夹
                        publicPath: 'images/', // 指定获取图片的路径
                        name: '[name].[ext]' // 输入的图片名
                    }
                }]
            }
        ]
    },
    plugins:[
        new CleanWebpackPlugin(),
        new MiniCssExtractPlugin(),
        new es3ifyPlugin(),
        new HtmlWebpackPlugin(Object.assign(
            {
                filename: 'index.html',
                template: 'src/index.html',
                defineMode:process.env.NODE_ENV,
                minify:{
                    collapseWhitespace: true,
                    removeComments: true,
                }
            },
            isProduction?{
                inlineSource: '.(js|css)$'
            }:{}
        )),

        isProduction ? new HtmlWebpackInlineSourcePlugin():function(){},
        // new CopyPlugin({
        //     patterns: [
        //       { from: 'src/lib/assets', to: '' }
        //     ],
        // })
    ],
    optimization: {
        minimizer: [
            new UglifyJSPlugin({
                uglifyOptions: {
                  compress: {
                        properties:false,
                        ie8:true
                    },
                    output:{
                        keep_quoted_props:true
                    }
                }
            })
        ],
    },
};