const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  entry: { index: path.resolve(__dirname, 'src', 'index.js') },
  output: {
    path: path.resolve(__dirname, 'build'),
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'index.html'),
    }),
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ['babel-loader'],
      },
    ],
  },
  // optimization: {
  //   splitChunks: { chunks: "all" },
  //   runtimeChunk: { name: "runtime" },
  // }
}
