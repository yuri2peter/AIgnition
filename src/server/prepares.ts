import fs from 'fs-extra';
import 'src/common/prepareLibs';
import {
  runtimeUploadsPath,
  rendererPath,
  runtimeDataPath,
  runtimeLogsPath,
  runtimeServerLogPath,
} from 'src/common/paths.app';
import { fileLog, showLargeTitle } from './utils/log';

export default function prepares() {
  showLargeTitle();
  uncaughtErrorHandle();
  handleServerClose();
  initFiles();
}

// 初始化文件
export function initFiles() {
  fs.ensureDirSync(rendererPath);
  fs.ensureDirSync(runtimeUploadsPath);
  fs.ensureDirSync(runtimeDataPath);
  fs.ensureDirSync(runtimeLogsPath);
  fs.ensureFileSync(runtimeServerLogPath);
}

// 服务端意外错误捕捉
export function uncaughtErrorHandle() {
  const handle = (e: Error) => {
    fileLog('Uncaught Error: ' + e.message, 'error');
  };
  try {
    process.on('uncaughtException', handle);
    process.on('unhandledRejection', handle);
  } catch (error: Error | any) {
    handle(error);
  }
}

// 服务端关闭回调
export function handleServerClose() {
  process.on('exit', (code) => {
    fileLog(`Server closed, code: ${code}.`, 'info');
  });
}
