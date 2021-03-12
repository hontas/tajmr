const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const WebpackPwaManifest = require('webpack-pwa-manifest');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');
const MiniCssExtractTextPlugin = require('mini-css-extract-plugin');
const SWPrecacheWebpackPlugin = require('sw-precache-webpack-plugin');
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const SentryWebpackPlugin = require('@sentry/webpack-plugin');
const pkg = require('./package.json');
require('dotenv').config();

const isProduction = process.env.NODE_ENV === 'production';
const publicPath = isProduction ? '/tajmr/' : '/';
const themeColor = '#1f8dd6';
const paths = {
  html: path.resolve(__dirname, 'client/index.html'),
  entry: path.resolve(__dirname, 'client/js/app.js'),
  regSW: path.resolve(__dirname, 'client/js/register-sw.js'),
  public: path.resolve(__dirname, 'public'),
  icon: path.resolve(__dirname, 'client/resources/apple-touch-icon.png')
};

if (!isProduction) {
  process.traceDeprecation = true;
}

const cssLoader = [{ loader: 'style-loader' }, { loader: 'css-loader' }];

const config = {
  mode: isProduction ? 'production' : 'development',

  devtool: isProduction ? '' : 'cheap-module-source-map',

  entry: {
    app: paths.entry,
    registerServiceWorker: paths.regSW
  },

  output: {
    path: paths.public,
    filename: isProduction ? '[name].[hash].js' : '[name].js',
    publicPath
  },

  devServer: {
    contentBase: paths.public,
    hot: true
  },

  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      },
      {
        test: /\.css$/,
        use: cssLoader
      },
      {
        test: /\.styl$/,
        include: /critical/,
        use: [
          isProduction ? MiniCssExtractTextPlugin.loader : { loader: 'style-loader' },
          { loader: 'css-loader' },
          { loader: 'stylus-loader' }
        ]
      },
      {
        test: /\.styl$/,
        exclude: /critical/,
        use: [...cssLoader, { loader: 'stylus-loader' }]
      }
    ]
  },

  optimization: {
    minimizer: [
      new TerserPlugin(),
      new OptimizeCSSAssetsPlugin({})
    ]
  },

  plugins: [
    new HtmlWebpackPlugin({
      title: pkg.name,
      template: paths.html,
      meta: {
        description: pkg.description,
        'application-name': pkg.name,
        'msapplication-TileImage': `${publicPath}icons/apple-touch-icon-144x144.png`,
        'msapplication-TileColor': themeColor
      },
      minimize: false
    }),
    new WebpackPwaManifest({
      name: pkg.name,
      description: pkg.description,
      orientation: 'any',
      start_url: publicPath,
      theme_color: themeColor,
      background_color: themeColor,
      icons: [
        {
          src: paths.icon,
          sizes: [192, 512],
          destination: path.join('icons', 'ios'),
          ios: true
        }
      ]
    }),
    new FaviconsWebpackPlugin({
      logo: paths.icon,
      title: pkg.name,
      prefix: 'icons/',
      background: themeColor,
      icons: {
        android: false,
        appleStartup: false,
        firefox: false
      }
    }),
    new MiniCssExtractTextPlugin({
      filename: isProduction ? '[name].[hash].css' : '[name].css'
    }),
    new ScriptExtHtmlWebpackPlugin({
      defaultAttribute: 'async',
      inline: /registerServiceWorker/
    }),
    new webpack.DefinePlugin({
      'process.env.BUILD_TIME': JSON.stringify(new Intl.DateTimeFormat('sv-SE', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date()))
    })
  ],
  stats: {
    children: false
  },

  watchOptions: {
    aggregateTimeout: 200
  }
};

if (isProduction) {
  config.plugins.push(
    new SWPrecacheWebpackPlugin({
      cacheId: 'tajmr',
      filename: 'service-worker.js',
      staticFileGlobsIgnorePatterns: [/\.map$/, /\.cache$/]
    }),
    new SentryWebpackPlugin({
      include: '.',
      ignoreFile: '.gitignore',
      ignore: ['node_modules', 'webpack.config.js']
    })
  );
} else {
  config.plugins.push(new webpack.HotModuleReplacementPlugin());
}

module.exports = config;
