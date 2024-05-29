import { app, BrowserWindow } from 'electron';
import {
  APP_NAME,
  DEV_RENDERER_PORT,
  IS_DEV,
  USE_WEB_SERVER,
} from 'src/common/config';
import {
  rendererIndexPath,
  preloadPath,
  serverAssetsIconPath,
} from 'src/common/paths.app';
import handleMainIpc from './ipc';
import { fileLog } from '../utils/log';
import buildMenu from './menu';

export default async function startElectron(port = 0) {
  await app.whenReady();
  fileLog('Electron main ready.');
  const createWindow = () => {
    const win = new BrowserWindow({
      width: 1280,
      height: 720,
      title: APP_NAME,
      webPreferences: {
        preload: preloadPath,
      },
      icon: serverAssetsIconPath,
    });
    buildMenu(win);
    const devRendererUrl = `http://127.0.0.1:${DEV_RENDERER_PORT}`;
    const prodRendererUrl = USE_WEB_SERVER
      ? `http://127.0.0.1:${port}`
      : `file://${rendererIndexPath}`;
    win.loadURL(IS_DEV ? devRendererUrl : prodRendererUrl);
  };
  handleMainIpc();
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });

  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
  });

  app.on('quit', () => {
    fileLog('Electron main quit.');
  });
}
