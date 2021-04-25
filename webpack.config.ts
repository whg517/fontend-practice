import * as path from 'path';

import {CleanWebpackPlugin} from 'clean-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';

const config = {
    mode: 'development',
    entry: './src/index.ts',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[contenthash].bundle.js',
    },
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: ['style-loader', 'css-loader'],
            },
            {
                test: /\.(png|svg|jpg|jpeg|gif)$/i,
                type: 'asset/resource'
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/i,
                type: 'asset/resource',
            },
        ],
    },
    devServer: {
        contentBase: './dist'
    },
    plugins: [
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin()
    ],
    stats: {
        all: false,
        assets: true,
        modules: false,
        entrypoints: false,
        children: false,
        warnings: true,
        errors: true,
    },
    optimization: {
        moduleIds: 'deterministic',
        // https://webpack.docschina.org/configuration/optimization/#optimizationsplitchunks
        // 分离代码
        splitChunks: {
            // 提取公共包
            cacheGroups: {
                vendor: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendors',
                    chunks: 'all',
                },
            },
        },
        // https://webpack.docschina.org/configuration/optimization/#optimizationruntimechunk
        // 将入口添加到单个文件中
        runtimeChunk: 'single',
    },
};

export default config;