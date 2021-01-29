import * as path from 'path';
import * as webpack from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
// import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';


/**
 * webpack config factory by env
 * @param env node env
 * @returns webpack.Configuration
 */
const config = (env: any): webpack.Configuration => {
  /**
   * Get mode from env.
   * If process.env.NODE_ENV is not `development` or `production`,
   * will use `development`.
   */
  const get_mode = () => {
    let env = process.env.NODE_ENV;
    if (env === 'development' || env === 'production') {
      return env
    }
    return 'development'
  }
  return {
    mode: get_mode(),
    entry: {
      index: './src/index.tsx',
    },
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: '[name].[contenthash].js',
      // chunkFilename: 'static/js/[name].chunk.js'
    },
    resolve: {
      // 让 webpack 支持更多文件类型，否则无法正常导入 `tsx` 格式文件
      // TODO: 解决其他文件，如 .css .saas
      extensions: ['.js', '.json', '.ts', '.tsx']
    },
    // 资源地图，便于调试的时候找到源文件。
    devtool: 'source-map',
    plugins: [
      new CleanWebpackPlugin(),
      // new BundleAnalyzerPlugin(),
      new HtmlWebpackPlugin({ title: 'Hello world!', template: './public/index.html' }),
    ],
    module: {
      rules: [
        {
          test: /\.css$/i,
          use: ['style-loader', 'css-loader'],
        },
        {
          // for any file with a suffix of js or jsx
          test: /\.tsx?$/,
          // ignore transpiling JavaScript from node_modules as it should be that state
          exclude: /node_modules/,
          // use the babel-loader for transpiling JavaScript to a suitable format
          loader: 'babel-loader',
          options: {
            // attach the presets to the loader (most projects use .babelrc file instead)
            presets: ["@babel/preset-env", "@babel/preset-react"]
          }
        }
      ],
    },
    // webpack output message
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
      moduleIds: 'hashed',
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
  }
};

export default config;