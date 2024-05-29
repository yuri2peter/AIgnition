// https://webpack.docschina.org/concepts/
import { Configuration } from 'webpack';
import {
  serverDistPath,
  srcPath,
  serverSrcPreloadPath,
} from '../src/common/paths.project';
import TsconfigPathsPlugins from 'tsconfig-paths-webpack-plugin';
import LodashModuleReplacementPlugin from 'lodash-webpack-plugin';

const config: Configuration = {
  entry: serverSrcPreloadPath,
  output: {
    path: serverDistPath,
    filename: 'preload.js',
  },
  target: 'electron-preload',
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
    // @ts-ignore
    new LodashModuleReplacementPlugin(),
  ],
  resolve: {
    extensions: ['.js', '.jsx', '.json', '.ts', '.tsx'],
    modules: [srcPath, 'node_modules'],
    // There is no need to add aliases here, the paths in tsconfig get mirrored
    plugins: [new TsconfigPathsPlugins()],
  },
};

export default config;
