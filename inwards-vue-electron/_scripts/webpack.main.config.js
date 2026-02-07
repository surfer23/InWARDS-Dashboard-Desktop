const path = require('path')
const webpack = require('webpack')
const CopyWebpackPlugin = require('copy-webpack-plugin')

const {
  dependencies,
  devDependencies,
  productName,
} = require('../package.json')

const isDevMode = process.env.NODE_ENV === 'development'

// Modules that should not be bundled (kept external)
// For main process, electron must be external
const externals = [
  'electron',  // Must be external for main process
  ...Object.keys(dependencies || {}).filter(d =>
    // Keep these bundled
    !['sql.js'].includes(d)
  ),
  { 'electron-debug': 'electron-debug' }
]

const config = {
  name: 'main',
  mode: process.env.NODE_ENV,
  devtool: isDevMode ? 'source-map' : 'source-map',
  entry: {
    main: path.join(__dirname, '../src/main/index.js'),
    preload: path.join(__dirname, '../src/main/preload.js')
  },
  externals: externals,
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.js$/,
        use: 'babel-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.node$/,
        use: 'node-loader',
      },
      {
        test: /\.docx$/,
        type: 'asset/resource',
        generator: {
          filename: '[name][ext]'
        }
      },
    ],
  },
  node: {
    __dirname: false,  // Keep real __dirname for preload path resolution
    __filename: false,
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.PRODUCT_NAME': JSON.stringify(productName),
    }),
  ],
  output: {
    filename: '[name].js',
    libraryTarget: 'commonjs2',
    path: path.join(__dirname, '../dist')
  },
  resolve: {
    extensions: ['.ts', '.js', '.json', '.node', '.jsx'],
    alias: {
      '@': path.join(__dirname, '../src/'),
      src: path.join(__dirname, '../src/'),
    },
  },
  target: 'electron-main',
}

if (isDevMode) {
  config.plugins.push(
    new webpack.DefinePlugin({
      __static: `"${path.join(__dirname, '../static').replace(/\\/g, '\\\\')}"`,
    })
  )
} else {
  config.plugins.push(
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.join(__dirname, '../src/data'),
          to: path.join(__dirname, '../dist/data'),
          noErrorOnMissing: true,
        },
        {
          from: path.join(__dirname, '../static'),
          to: path.join(__dirname, '../dist/static'),
          globOptions: {
            ignore: ['.*'],
          },
          noErrorOnMissing: true,
        },
      ],
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: true,
    })
  )
}

module.exports = config
