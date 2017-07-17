module.exports =
{
  test: /\.erb$/,
  enforce: 'pre',
  exclude: /node_modules/,
  loader: 'rails-erb-loader',
  options: {
    runner: 'bin/rails runner'
  }
}, {
  test: /\.erb$/,
  enforce: 'pre',
  exclude: /spec/,
  loader: 'rails-erb-loader',
  options: {
    runner: 'bin/rails runner'
  }
}

