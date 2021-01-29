# 前端实践

记录我个人总结的一个前端项目实践。

## 一、初始化

### 1. 初始化项目

#### 1.1 初始化资源目录

```bash
mkdir src
```

创建 `index.ts` 文件.

#### 1.2 初始化公共目录

```bash
mkdir public
```

创建 `index.html` 模板文件：

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta
      name="description"
      content="React App"
    />
    <title>React App</title>
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>
```

### 2. 初始化 npm 包信息

```bash
npm init
```

然后根据实际情况需改 `packages.json` 信息。

### 3. 初始化 typescript

[tsc CLI Options](https://www.typescriptlang.org/docs/handbook/compiler-options.html)

```bash
npx tsc --init
```

### 4. 初始化 Webpack

安装：

[Installation](https://webpack.js.org/guides/installation/)

```bash
npm install webpack webpack-cli --save-dev ts-node @types/node @types/webpack
```

#### 4.1 初始化配置

[Configuration Typescript](https://webpack.js.org/configuration/configuration-languages/#typescript)

新建 `webpack.config.ts` 文件，增加如下内容：

```ts
import * as path from 'path';
import * as webpack from 'webpack';

const config: webpack.Configuration = {
  mode: 'development',
  entry: './src/index.ts',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'main.js'
  }
};

export default config;
```

较新版的 webpack 支持零配置，但是在实际开发中会有很多优化，所以需要调整默认配置。

#### 4.2 修改启动命令

为了更方便的使用 webpack 的命令，需要将命令注册到 npm 上面。

修改 `package.json` 的 `scripts` ：

```json
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "build": "webpack"
  },
```

运行构建命令：

```bash
npm run build
```

可以看到生成的目标文件在 `dist` 目录中。

#### 4.3 Webpack 配置优化

##### 4.3.1 css

安装 loader

```bash
npm install --save-dev style-loader css-loader
```

在 `webpack.config.ts` 配置中增加 `module.rules` ：

**提示：** loader 是从左到右的顺序加载的。

```ts
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
```

##### 4.3.2 图片

安装 loader

```bash
npm install --save-dev style-loader css-loader
```

在 `webpack.config.ts` 配置中增加 `module.rules` ：

```ts
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
      },
```

##### 4.3.3 字体

安装 loader

```bash
npm install --save-dev style-loader css-loader
```

在 `webpack.config.ts` 配置中增加 `module.rules` ：

```ts
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',
      },
```

##### 4.3.4 数据

安装 loader

```bash
npm install --save-dev csv-loader xml-loader
```

在 `webpack.config.ts` 配置中增加 `module.rules` ：

```ts
      {
        test: /\.(csv|tsv)$/i,
        use: ['csv-loader'],
      },
      {
        test: /\.xml$/i,
        use: ['xml-loader'],
      },
```

##### 4.3.5 自动更新 HTML

安装 plugin

```bash
npm install --save-dev html-webpack-plugin
```

在 `webpack.config.ts` 中导入：

```ts
import HtmlWebpackPlugin from 'html-webpack-plugin';
```

在 `webpack.config.ts` 配置中增加 `module.rules` ：

```ts
  plugins: [
    new HtmlWebpackPlugin({ title: 'Hello world!', template: './public/index.html' }),
  ],
```

##### 4.3.6 自动清理 dist 目录

安装 plugin

```bash
npm install clean-webpack-plugin
```

在 `webpack.config.ts` 中导入：

```ts
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
```

在 `webpack.config.ts` 配置中增加 `module.rules` ：

```ts
  plugins: [
    new CleanWebpackPlugin(),
  ],
```

##### 4.3.7 开发服务器

安装：

```bash
npm install --save-dev webpack-dev-server @types/webpack-dev-server
```

`@types/webpack-dev-server` 模块会会为 `webpack` 配置提供 `devServer` 配置

在 `webpack.config.ts` 中加入 `devServer` ：

```ts
  devServer: {
    contentBase: './dist',
  },
```

增加启动命令：

```json
"start": "webpack serve --open",
```

##### 4.3.8 控制台输出

优化控制台信息输出。

在 `webpack.config.ts` 中加入 ：

```ts
  stats: {
    all: false,
    assets: true,
    modules: false,
    entrypoints: false,
    children: false,
    warnings: true,
    errors: true,
  }
```

##### 4.3.9 增加优化参数

在 `webpack.config.ts` 文件中增加：

```ts
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
```

### 5. 初始化 React

安装：

```bash
npm i --save @types/react-dom react-dom @types/react react
npm install --save-dev @babel/core babel-loader @babel/preset-env @babel/preset-react
```

更改 `webpack.config.ts` 中的 `entry: './src/index.tsx',`

在 `webpack.config.ts` 的 `module.rules` 中增加：

```ts
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
```

将 `src/index.ts` 改成 `src/index.tsx` ，修改内容为：

```jsx
import ReactDOM from 'react-dom'

ReactDOM.render(
  <div>Hello world!</div>,
  document.body
);
```
