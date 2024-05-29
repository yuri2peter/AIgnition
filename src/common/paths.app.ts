import path from 'path';

export const AppPath = path.resolve(__dirname, '..');
export const runtimePath = path.resolve(AppPath, 'runtime');
export const runtimeUploadsPath = path.resolve(runtimePath, 'uploads');
export const runtimeDataPath = path.resolve(runtimePath, 'data');
export const runtimeLogsPath = path.resolve(runtimePath, 'logs');
export const runtimeServerLogPath = path.resolve(runtimeLogsPath, 'server.log');
export const rendererPath = path.resolve(AppPath, 'renderer');
export const serverPath = path.resolve(AppPath, 'server');
export const rendererIndexPath = path.resolve(rendererPath, 'index.html');
export const preloadPath = path.resolve(serverPath, 'preload.js');
export const serverAssetsIconPath = path.resolve(
  serverPath,
  'assets/icons/png/128x128.png'
);
export const AppEnvPath = path.resolve(AppPath, '.env');
