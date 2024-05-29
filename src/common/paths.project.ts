import path from 'path';

export const rootPath = path.resolve(__dirname, '../../');
export const distPath = path.resolve(rootPath, 'dist');
export const srcPath = path.resolve(rootPath, 'src');
export const assetsPath = path.resolve(rootPath, 'assets');
export const rootAssetsPath = path.resolve(assetsPath, 'root');
export const commonAssetsPath = path.resolve(assetsPath, 'common');
export const rendererAssetsPath = path.resolve(assetsPath, 'renderer');
export const rendererDistPath = path.resolve(distPath, 'renderer');
export const rendererSrcPath = path.resolve(srcPath, 'renderer');
export const rendererSrcIndexPath = path.resolve(rendererSrcPath, 'index.tsx');
export const rendererSrcHtmlPath = path.resolve(rendererSrcPath, 'index.html');
export const serverDistPath = path.resolve(distPath, 'server');
export const serverSrcPath = path.resolve(srcPath, 'server');
export const serverSrcPreloadPath = path.resolve(
  serverSrcPath,
  'electron/preload.ts'
);
export const serverAssetsPath = path.resolve(assetsPath, 'server');
export const srcEnvPath = path.resolve(srcPath, '.env');
