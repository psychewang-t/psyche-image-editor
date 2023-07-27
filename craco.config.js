const CracoLessPlugin = require('craco-less');
const path = require('path');
const resolve = (dir) => path.resolve(__dirname, dir);
const webpack = require('webpack');

module.exports = {
  plugins: [
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            modifyVars: { '@primary-color': '#2254f4' },
            javascriptEnabled: true
          }
        }
      }
    }
  ],
  webpack: {
    alias: {
      '@': resolve('src')
    },
    plugins: [
      //热更新插件
      new webpack.HotModuleReplacementPlugin()
    ],
    resolve: {
      symlinks: true
    }
  }
};
