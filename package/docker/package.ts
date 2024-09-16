import path from 'path';
import fs from 'fs-extra';
import { executeCommand } from '../../dev/utils/miscs';
import versionInfo from '../../src/common/version.json';

const buildCommand = `docker build -f ./Dockerfile -t yuri2/aignition:${versionInfo.version} ./`;
const pushCommand = `docker tag yuri2/aignition:${versionInfo.version} yuri2/aignition:latest && docker push yuri2/aignition:${versionInfo.version} && docker push yuri2/aignition:latest`;

const pathDist = path.resolve(__dirname, '../../dist');
const pathContext = path.resolve(__dirname, 'context');
const pathContextDist = path.resolve(pathContext, 'dist');
const pathContextDistRuntime = path.resolve(pathContextDist, 'runtime');
const pathContextDistEnv = path.resolve(pathContextDist, '.env');
const pathTest = path.resolve(__dirname, 'test');

async function main() {
  console.log('Building docker image...');
  // prepare context
  await fs.emptyDir(pathContextDist);
  await fs.copy(pathDist, pathContextDist);
  await fs.emptyDir(pathContextDistRuntime);
  await fs.writeFile(pathContextDistEnv, '');
  // packaging docker image
  await executeCommand(buildCommand, pathContext)
    .then(console.log)
    .catch(console.error);
  console.log(`Build completed, test directory: ${pathTest}`);
  console.log('Pushing docker image...');
  await executeCommand(pushCommand, pathContext);
  console.log(`Image yuri2/aignition:${versionInfo.version} has been pushed.`);
}

main();
