import './importEnv';
import prepares from './prepares';
import { USE_ELECTRON, USE_WEB_SERVER } from 'src/common/config';
import { fileLog } from './utils/log';

async function main() {
  prepares();
  fileLog('Server start.');

  let port = 0;
  if (USE_WEB_SERVER) {
    const { default: startWeb } = await import('./web/startWeb');
    port = await startWeb();
  }
  if (USE_ELECTRON) {
    const { default: startElectron } = await import('./electron/startElectron');
    await startElectron(port);
  }
}

main();
