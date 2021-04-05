const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const packageJson = require('./package');
const isProduction = process.env.NODE_ENV === 'production';

const webpackConfig = {
  cache: true,
  devtool: isProduction ? 'eval-source-map' : 'source-map',
  entry: {
    app: [
      path.resolve(__dirname, 'app', 'js', 'client.js')
    ]
  },
  output: {
    path: path.resolve(__dirname, 'public'),
    filename: '[name].bundle.js',
    sourceMapFilename: '[file].map',
    pathinfo: true,
    publicPath: '/',
  },
  resolve: {
    extensions: [
      '.js',
      '.css',
      '.scss'
    ]
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: packageJson.babel.presets,
              cacheDirectory: true
            }
          }
        ],
        include: [
          path.resolve(__dirname, 'node_modules'),
          path.resolve(__dirname, 'assets')
        ]
      },
      {
        test: /\.(eot|woff|woff2|svg|ttf)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              limit: 100000,
            }
          }
        ]
      },
      {
        test: /\.scss$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader
          }
          ,
          {
            loader: 'css-loader',
          },
          {
            loader: 'resolve-url-loader'
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true,
              includePaths: [
                path.resolve(__dirname, 'node_modules/')
              ]
            }
          }
        ],
        include: [
          path.resolve(__dirname, 'node_modules'),
          path.resolve(__dirname, 'app')
        ]
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'style.css',
    }),
    new webpack.NoEmitOnErrorsPlugin()
  ]
};

module.exports = webpackConfig;
