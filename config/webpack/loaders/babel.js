module.exports =
{
  test: /\.js(\.erb)?$/,
  exclude: /node_modules/,
  loader: 'babel-loader'
},
{
  test: /\.js(\.erb)?$/,
  exclude: /spec/,
  loader: 'babel-loader'
}

