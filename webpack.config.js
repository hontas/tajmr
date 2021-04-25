const path = require('path');
const webpack = require('webpack');
const WorkboxPlugin = require('workbox-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const WebpackPwaManifest = require('webpack-pwa-manifest');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const SentryWebpackPlugin = require('@sentry/webpack-plugin');
// const {BundleAnalyzerPlugin} = require('webpack-bundle-analyzer');
const pkg = require('./package.json');
require('dotenv').config();

const isProduction = process.env.NODE_ENV === 'production';
const publicPath = isProduction ? '/tajmr/' : '/';
const themeColor = '#1f8dd6';
const paths = {
  html: path.resolve(__dirname, 'client/index.html'),
  entry: path.resolve(__dirname, 'client/js/app.js'),
  public: path.resolve(__dirname, 'public'),
  icon: path.resolve(__dirname, 'client/resources/apple-touch-icon.png'),
};

if (!isProduction) {
  process.traceDeprecation = true;
}

const cssLoader = [
  { loader: 'style-loader' },
  {
    loader: 'css-loader',
    options: {
      modules: {
        auto: true,
        localIdentName: isProduction ? '[hash:base64]' : '[name]__[local]',
      },
    },
  },
];

const config = {
  mode: isProduction ? 'production' : 'development',

  entry: {
    app: paths.entry,
  },

  output: {
    path: paths.public,
    filename: isProduction ? '[name].[contenthash].js' : '[name].js',
    publicPath,
  },

  devServer: {
    contentBase: paths.public,
    hot: true,
  },

  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
      {
        test: /\.css$/,
        use: cssLoader,
      },
      {
        test: /\.styl$/,
        include: /critical/,
        use: [
          isProduction ? MiniCssExtractPlugin.loader : { loader: 'style-loader' },
          { loader: 'css-loader' },
          { loader: 'stylus-loader' },
        ],
      },
      {
        test: /\.styl$/,
        exclude: /critical/,
        use: [...cssLoader, { loader: 'stylus-loader' }],
      },
    ],
  },

  optimization: {
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name(module) {
            const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1];
            return `npm.${packageName.replace('@', '')}`;
          },
        },
      },
    },
    minimizer: [new TerserPlugin(), new CssMinimizerPlugin()],
  },

  plugins: [
    new HtmlWebpackPlugin({
      title: pkg.name,
      template: paths.html,
      meta: {
        description: pkg.description,
        'application-name': pkg.name,
      },
      minimize: false,
    }),
    new WebpackPwaManifest({
      name: pkg.name,
      description: pkg.description,
      orientation: 'any',
      start_url: publicPath,
      theme_color: themeColor,
      background_color: themeColor,
      ios: true,
      icons: [
        {
          src: paths.icon,
          sizes: [192, 512],
        },
      ],
    }),
    new FaviconsWebpackPlugin({
      logo: paths.icon,
      title: pkg.name,
      background: themeColor,
      cache: true,
      favicons: {
        icons: {
          android: false,
          appleIcon: true,
          appleStartup: false,
          coast: false,
          firefox: false,
          windows: false,
          yandex: false,
        },
      },
    }),
    new MiniCssExtractPlugin({
      filename: isProduction ? '[name].[contenthash].css' : '[name].css',
    }),
    new webpack.DefinePlugin({
      'process.env.BUILD_TIME': JSON.stringify(
        new Intl.DateTimeFormat('sv-SE', { dateStyle: 'medium', timeStyle: 'short' }).format(
          new Date()
        )
      ),
      'process.env.RELEASE': JSON.stringify(`${pkg.name}@${pkg.version}`),
    }),
    new WorkboxPlugin.GenerateSW({
      clientsClaim: true,
      skipWaiting: true,
    }),
  ],
  stats: {
    children: false,
  },

  watchOptions: {
    aggregateTimeout: 200,
  },
};

if (isProduction) {
  config.plugins.push(
    new SentryWebpackPlugin({
      include: 'client',
      ignoreFile: '.gitignore',
    })
    // new BundleAnalyzerPlugin()
  );
} else {
  config.plugins.push(new webpack.HotModuleReplacementPlugin());
  config.devtool = 'eval-source-map';
}

module.exports = config;
