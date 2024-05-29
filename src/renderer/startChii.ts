// dev only
import { consoleLog } from '../common/utils/dev';
import { CHII_PORT, USE_CHII } from '../common/config';
const { start } = require('chii');

export function startChii(port = 0) {
  start({
    port,
    basePath: '/chii',
  });
  consoleLog(
    'Chii Web debugger is running at: http://127.0.0.1:' + port + '/chii',
    'CHII'
  );
}

USE_CHII && startChii(CHII_PORT);
