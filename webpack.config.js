const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const MiniCssExtractTextPlugin = require('mini-css-extract-plugin');
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin');
const pkg = require('./package.json');

const isProduction = process.env.NODE_ENV === 'production';
const paths = {
  entry: path.resolve(__dirname, './client/js/app.js'),
  public: path.resolve(__dirname, './public')
};

if (!isProduction) {
  process.traceDeprecation = true;
}

const config = {
  mode: isProduction ? 'production' : 'development',

  devtool: isProduction ? '' : 'cheap-module-source-map',

  entry: {
    app: paths.entry
  },

  output: {
    path: paths.public,
    filename: '[name].[hash].js',
    publicPath: isProduction ? '/tajmr/' : '/'
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
        test: /\.styl$/,
        include: /critical/,
        use: [
          (isProduction ? MiniCssExtractTextPlugin.loader : { loader: 'style-loader' }),
          { loader: 'css-loader' },
          { loader: 'stylus-loader' }
        ]
      },
      {
        test: /\.styl$/,
        exclude: /critical/,
        loader: 'style-loader!css-loader!stylus-loader'
      },
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader'
      },
      {
        test: /\.jade$/,
        loader: 'jade-loader'
      }
    ]
  },

  plugins: [
    new HtmlWebpackPlugin({
      title: pkg.name,
      template: 'template.jade',
      minimize: false
    }),
    new MiniCssExtractTextPlugin('styles.css'),
    new ScriptExtHtmlWebpackPlugin({
      defaultAttribute: 'async'
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
  config.plugins.push(new CompressionPlugin({ test: /\.(js|css)/ }));
} else {
  config.plugins.push(
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin()
  );
}

module.exports = config;
