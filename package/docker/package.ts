import path from 'path';
import fs from 'fs-extra';
import { executeCommand } from '../../dev/utils/miscs';

const buildCommand = 'docker build -f ./Dockerfile -t myapp:v1 ./';

const pathDist = path.resolve(__dirname, '../../dist');
const pathContext = path.resolve(__dirname, 'context');
const pathContextDist = path.resolve(pathContext, 'dist');
const pathContextDistRuntime = path.resolve(pathContextDist, 'runtime');
const pathContextDistEnv = path.resolve(pathContextDist, '.env');
const pathTest = path.resolve(__dirname, 'test');

async function main() {
  console.log('打包docker镜像');
  // 准备context
  await fs.emptyDir(pathContextDist);
  await fs.copy(pathDist, pathContextDist);
  await fs.emptyDir(pathContextDistRuntime);
  await fs.writeFile(pathContextDistEnv, '');
  // 打包镜像
  await executeCommand(buildCommand, pathContext)
    .then(console.log)
    .catch(console.error);
  console.log(`打包完成，测试目录：${pathTest}`);
}

main();
