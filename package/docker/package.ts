import path from 'path';
import fs from 'fs-extra';
import { executeCommand } from '../../dev/utils/miscs';
import versionInfo from '../../src/common/version.json';

const buildCommand = `docker build -f ./Dockerfile -t yuri2/aignition:${versionInfo.version} ./`;

const pathDist = path.resolve(__dirname, '../../dist');
const pathContext = path.resolve(__dirname, 'context');
const pathContextDist = path.resolve(pathContext, 'dist');
const pathContextDistRuntime = path.resolve(pathContextDist, 'runtime');
const pathContextDistEnv = path.resolve(pathContextDist, '.env');
const pathTest = path.resolve(__dirname, 'test');

async function main() {
  console.log('Building docker image...');
  // 准备context
  await fs.emptyDir(pathContextDist);
  await fs.copy(pathDist, pathContextDist);
  await fs.emptyDir(pathContextDistRuntime);
  await fs.writeFile(pathContextDistEnv, '');
  // 打包镜像
  await executeCommand(buildCommand, pathContext)
    .then(console.log)
    .catch(console.error);
  console.log(`Build completed, test directory: ${pathTest}`);
}

main();
