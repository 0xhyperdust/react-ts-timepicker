const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const pkg = require('./package.json');
const path = require('path');
const libraryName= pkg.name;

module.exports = {
  entry: path.join(__dirname, "./src/TimePicker.tsx"),
  mode: 'production',
  output: {
    path: path.join(__dirname, './dist'),
    filename: 'TimePicker.js',
    library: libraryName,
    libraryTarget: 'umd',
    publicPath: '/dist/',
    umdNamedDefine: true
  },
  node: {
    net: 'empty',
    tls: 'empty',
    dns: 'empty'
  },
  module: {
    rules : [
      {
        test: /\.scss$/,
        use: [
          'style-loader',
          'css-loader',
          'sass-loader'
        ],
        exclude: /node_modules/,
      },
      {
        test: /\.tsx?$/,
        loader: 'awesome-typescript-loader'
      },
      {
        enforce: 'pre',
        test: /\.js$/,
        loader: 'source-map-loader'
      },
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'sass-loader'
        ],
        exclude: /node_modules/,
      },
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].css'
    }),
  ],
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.json'],
    alias: {
      'react': path.resolve(__dirname, './node_modules/react') ,
      'react-dom': path.resolve(__dirname, './node_modules/react-dom'),
      'assets': path.resolve(__dirname, 'assets')
    }
  },
  externals: {
    react: {
      commonjs: "react",
      commonjs2: "react",
      amd: "React",
      root: "React"
    },
    "react-dom": {
      commonjs: "react-dom",
      commonjs2: "react-dom",
      amd: "ReactDOM",
      root: "ReactDOM"
    }
  }
};
