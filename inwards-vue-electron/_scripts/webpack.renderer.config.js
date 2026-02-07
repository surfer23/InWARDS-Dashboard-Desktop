const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { VueLoaderPlugin } = require('vue-loader')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

const {
  dependencies,
  devDependencies,
  productName,
} = require('../package.json')

const isDevMode = process.env.NODE_ENV === 'development'

// Modules that should be bundled with the renderer
const whiteListedModules = ['vue', 'sql.js', 'axios']

// External modules (not bundled)
const externals = Object.keys(dependencies || {}).filter(d =>
  !whiteListedModules.includes(d)
)

const config = {
  name: 'renderer',
  mode: process.env.NODE_ENV,
  devtool: isDevMode ? 'source-map' : 'source-map',
  entry: {
    renderer: path.join(__dirname, '../src/renderer/main.js')
  },
  output: {
    path: path.join(__dirname, '../dist'),
    filename: '[name].js'
  },
  // No externals needed - all dependencies are bundled for browser context
  module: {
    rules: [
      // Expose jQuery globally for bootstrap-table and other plugins
      {
        test: require.resolve('jquery'),
        loader: 'expose-loader',
        options: {
          exposes: ['$', 'jQuery'],
        },
      },
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              appendTsSuffixTo: [/\.vue$/],
            },
          },
        ],
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
        test: /\.vue$/,
        loader: 'vue-loader',
      },
      {
        test: /\.s(c|a)ss$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
          },
          {
            loader: 'css-loader',
          },
          {
            loader: 'sass-loader',
            options: {
              implementation: require('sass'),
              // Use modern API to avoid deprecation warnings
              api: 'modern',
            },
          },
        ],
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
          },
          'css-loader',
        ],
      },
      {
        test: /\.(png|jpe?g|gif|tif?f|bmp|webp|svg)(\?.*)?$/,
        type: 'asset',
        parser: {
          dataUrlCondition: {
            maxSize: 10 * 1024 // 10kb
          }
        },
        generator: {
          filename: 'imgs/[name]--[hash:8][ext]'
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        type: 'asset',
        parser: {
          dataUrlCondition: {
            maxSize: 10 * 1024
          }
        },
        generator: {
          filename: 'fonts/[name]--[hash:8][ext]'
        }
      },
      {
        test: /\.docx$/,
        type: 'asset/resource',
        generator: {
          filename: '[name][ext]'
        }
      },
      {
        // Handle sql.js wasm file
        test: /\.wasm$/,
        type: 'asset/resource',
        generator: {
          filename: 'sql-wasm/[name][ext]'
        }
      },
    ],
  },
  node: {
    __dirname: isDevMode,
    __filename: isDevMode
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: path.resolve(__dirname, '../src/index.ejs'),
      minify: {
        collapseWhitespace: true,
        removeAttributeQuotes: true,
        removeComments: true
      },
      isBrowser: false,
      isDevelopment: isDevMode,
      nodeModules: isDevMode
        ? path.resolve(__dirname, '../node_modules')
        : false
    }),
    new VueLoaderPlugin(),
    new webpack.DefinePlugin({
      'process.env.PRODUCT_NAME': JSON.stringify(productName),
      // Vue 3 feature flags
      '__VUE_OPTIONS_API__': true,
      '__VUE_PROD_DEVTOOLS__': false,
      '__VUE_PROD_HYDRATION_MISMATCH_DETAILS__': false,
    }),
    // Provide polyfills for Node.js globals and jQuery for plugins
    new webpack.ProvidePlugin({
      process: 'process/browser',
      $: 'jquery',
      jQuery: 'jquery',
      'window.jQuery': 'jquery',
    }),
    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[id].css',
    }),
  ],
  resolve: {
    alias: {
      'vue$': 'vue/dist/vue.esm-bundler.js',
      '@': path.join(__dirname, '../src/renderer'),
      src: path.join(__dirname, '../src/'),
      icons: path.join(__dirname, '../_icons/'),
      // Redirect electron.remote to our compatibility layer
      'electron': path.join(__dirname, '../src/renderer/services/electron-compat.js'),
    },
    extensions: ['.ts', '.js', '.vue', '.json', '.node', '.jsx'],
    fallback: {
      // Polyfills for Node.js core modules used by various libraries
      'fs': false,
      'path': require.resolve('path-browserify'),
      'crypto': false,
      'os': false,
      'assert': false,
      'util': false,
      'stream': false,
      'constants': false,
      'process': require.resolve('process/browser'),
    }
  },
  // Use 'web' target since contextIsolation: true means no Node.js in renderer
  target: 'web',
}

/**
 * Adjust rendererConfig for development/production settings
 */
if (isDevMode) {
  config.plugins.push(
    new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin({
      '__static': `"${path.join(__dirname, '../static').replace(/\\/g, '\\\\')}"`
    })
  )
} else {
  config.plugins.push(
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.join(__dirname, '../static'),
          to: path.join(__dirname, '../dist/static'),
          globOptions: {
            ignore: ['.*'],
          },
          noErrorOnMissing: true,
        },
        // Copy sql.js wasm files
        {
          from: path.join(__dirname, '../node_modules/sql.js/dist/sql-wasm.wasm'),
          to: path.join(__dirname, '../dist/sql-wasm/'),
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
