const path = require('path');

module.exports = {
  entry: './src/index.ts',
  mode: 'development',
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, 'lib'),
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  devServer: {
    static: [
      { directory: path.join(__dirname, 'examples'), },
      {
        directory: path.join(__dirname, 'lib'),
        publicPath: '/lib',
      }
    ],
    port: 9000,
  },
};
