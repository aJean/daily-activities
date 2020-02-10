const webpack = require('webpack');
const path = require('path');
// CleanWebpackPlugin - prod

/**
 * @file compile
 */

module.exports = {
  mode: 'development',
  devtool: 'none',
  optimization: {
    minimize: false
  },
  entry: {
    esm: './src/esm.ts',
    cmd: './src/cmd.js'
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
    chunkFilename: '[name].chunk.js' // 切片命名
  },
  optimization: {
    runtimeChunk: {
      name: 'runtime'
    }
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: 'ts-loader'
      }
    ]
  },
  plugins: [],
  resolve: {
    extensions: ['.js', '.json', '.ts', '.tsx']
  }
};
