import path from 'path';

export const AppPath = path.resolve(__dirname, '..');
export const runtimePath = path.resolve(AppPath, 'runtime');
export const runtimeTempPath = path.resolve(runtimePath, 'temp');
export const runtimeTempArchivePath = path.resolve(runtimeTempPath, 'archive');
export const runtimeTempArchiveZipPath = path.resolve(
  runtimeTempArchivePath,
  'data.zip'
);
export const runtimeTempArchiveDirPath = path.resolve(
  runtimeTempArchivePath,
  'data'
);
export const runtimeUploadsPath = path.resolve(runtimePath, 'uploads');
export const runtimeDataPath = path.resolve(runtimePath, 'data');
export const runtimeLogsPath = path.resolve(runtimePath, 'logs');
export const runtimeServerLogPath = path.resolve(runtimeLogsPath, 'server.log');
export const rendererPath = path.resolve(AppPath, 'renderer');
export const serverPath = path.resolve(AppPath, 'server');
export const userGuidePath = path.resolve(
  serverPath,
  'assets/📘 AIgnition User Guide'
);
export const rendererIndexPath = path.resolve(rendererPath, 'index.html');
export const preloadPath = path.resolve(serverPath, 'preload.js');
export const serverAssetsIconPath = path.resolve(
  serverPath,
  'assets/icons/png/128x128.png'
);
export const AppEnvPath = path.resolve(AppPath, '.env');
