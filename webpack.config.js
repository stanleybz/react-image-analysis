// 這邊使用 HtmlWebpackPlugin，將 bundle 好得 <script> 插入到 body
var CleanWebpackPlugin = require('clean-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var webpack = require('webpack'); // Plugins compression use
var CompressionPlugin = require('compression-webpack-plugin'); // Plugins compression use
var HtmlWebpackPlugin = require('html-webpack-plugin');
var randomName = (Math.random().toString(36)+'00000000000000000').slice(2, 8);

// 檔案起始點從 entry 進入，也可以是多個檔案。output 是放入產生出來的結果的相關參數。loaders 則是放欲使用的 loaders，在這邊是使用 babel-loader 將所有 .js（這邊用到正則式）相關檔案轉譯成瀏覽器可以閱讀的 JavaScript。devServer 則是 webpack-dev-server 設定。plugins 放置所使用的外掛
module.exports = {
  entry: [
    './src/index.js',
  ],
  output: {
    path: `${__dirname}/build`,
    publicPath: '/',
    filename: 'main'+randomName+'.js',
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015', 'react', 'stage-0'],
        },
      },
      {
        test: /\.css$/,
        use: [ 'style-loader', 'css-loader' ]
      }
    ],
  },
  devServer: {
    historyApiFallback: true,
    inline: true,
    port: 8008,
  },
  plugins: [
    new CleanWebpackPlugin(['./build/*']),
    new HtmlWebpackPlugin({
      template: `${__dirname}/public/index.html`,
      filename: 'index.html',
      inject: 'body',
    }),
    new CopyWebpackPlugin([{
           from: './public', to: '.'
    }]),
    new webpack.DefinePlugin({ // <-- key to reducing React's size
      'process.env': {
        // 'NODE_ENV': JSON.stringify('production')
      }
    }),
    new webpack.optimize.DedupePlugin(), //dedupe similar code
    new webpack.optimize.UglifyJsPlugin(), //minify everything
    new webpack.optimize.AggressiveMergingPlugin(),//Merge chunks
    // new CompressionPlugin({
    //   asset: "[path].gz[query]",
    //   algorithm: "gzip",
    //   test: /\.js$|\.css$|\.html$/,
    //   threshold: 10240,
    //   minRatio: 0.8
    // })
  ],
};
