import openBrowsers from 'open-browsers';
import detect from 'detect-port';
import {
  OPEN_BROWSER_AFTER_WEB_SERVER_START,
  SERVER_PORT,
  USE_SOCKET,
} from 'src/common/config';
import startKoa from './startKoa';
import { startSocket } from '../socket/startSocket';
import { AddressInfo } from 'net';
import { fileLog } from '../utils/log';

export default async function startWeb() {
  // port
  const serverPort = SERVER_PORT;
  if (serverPort) {
    const portAvailable = await checkPort(serverPort);
    if (!portAvailable) {
      const err = `Port ${serverPort} is not available.`;
      fileLog(err, 'error');
      throw new Error(err);
    }
  }

  // start server
  const server = startKoa();
  USE_SOCKET && startSocket(server);
  await new Promise<void>((resolve) => {
    server.listen(serverPort, resolve);
  });

  // 获取实际地址
  const addressInfo = server.address() as AddressInfo;
  const { port } = addressInfo;
  const url = `http://127.0.0.1:${port}`;
  fileLog(`Local:   ${url}`, 'server');

  // open browser
  OPEN_BROWSER_AFTER_WEB_SERVER_START && openBrowsers(url);
  return port;
}

async function checkPort(serverPort: number) {
  const _port = await detect(serverPort);
  return _port === serverPort;
}
