// https://webpack.docschina.org/concepts/
import { Configuration, NormalModuleReplacementPlugin } from 'webpack';
import {
  serverSrcPath,
  serverDistPath,
  commonAssetsPath,
  serverAssetsPath,
  srcPath,
  rootAssetsPath,
  srcEnvPath,
} from '../src/common/paths.project';
import CopyPlugin from 'copy-webpack-plugin';
import TsconfigPathsPlugins from 'tsconfig-paths-webpack-plugin';
import LodashModuleReplacementPlugin from 'lodash-webpack-plugin';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import { IS_DEV, USE_ELECTRON } from '../src/common/config';

const config: Configuration = {
  entry: serverSrcPath,
  output: {
    path: serverDistPath,
    filename: '[name].js',
  },
  target: USE_ELECTRON ? 'electron-main' : 'node',
  stats: 'errors-only',
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        use: 'babel-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.ts(x)?$/,
        loader: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        { from: commonAssetsPath, to: 'assets' },
        { from: serverAssetsPath, to: 'assets' },
        { from: rootAssetsPath, to: '../' },
        { from: srcEnvPath, to: '../' },
      ],
    }),
    // @ts-ignore
    new LodashModuleReplacementPlugin(),
    new CleanWebpackPlugin(),
    // 解决hexoid打包时的错误
    new NormalModuleReplacementPlugin(
      /^hexoid$/,
      // eslint-disable-next-line node/no-extraneous-require
      require.resolve('hexoid/dist/index.js')
    ),
  ],
  resolve: {
    extensions: ['.js', '.jsx', '.json', '.ts', '.tsx'],
    modules: [srcPath, 'node_modules'],
    // There is no need to add aliases here, the paths in tsconfig get mirrored
    plugins: [new TsconfigPathsPlugins()],
  },
  devtool: IS_DEV ? 'inline-source-map' : false,
  optimization: {
    runtimeChunk: 'single',
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
        },
      },
    },
  },
  // 标记不需要被打包的库
  // externals: ['utf-8-validate', 'bufferutil'],
};

export default config;
