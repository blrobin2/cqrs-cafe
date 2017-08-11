module.exports = {
  entry: './src/index.ts',
  output: {
    path: __dirname + '/build',
    filename: 'bundle.js'
  },
  resolve: {
    // Add .ts .tsx as a resolvable extension.
    extensions: ['.ts', '.tsx', '.js']
  },
  module: {
    loaders: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader'
      }
    ]
  }
}