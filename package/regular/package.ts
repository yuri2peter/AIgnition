import path from 'path';
import fs from 'fs-extra';
import { zip } from 'zip-a-folder';

const pathDist = path.resolve(__dirname, '../../dist');
const pathRelease = path.resolve(__dirname, 'release');
const pathReleaseOutput = path.resolve(pathRelease, 'output');
const pathArchive = path.resolve(pathRelease, 'archive.zip');
const pathReleaseOutputDist = path.resolve(pathReleaseOutput, 'dist');
const pathReleaseOutputDistEnv = path.resolve(pathReleaseOutputDist, '.env');
const pathReleaseOutputDistRuntime = path.resolve(
  pathReleaseOutputDist,
  'runtime'
);
const pathOverwrite = path.resolve(__dirname, 'overwrite');

async function main() {
  console.log('Package regular node applications');
  // 准备目录
  await fs.ensureDir(pathRelease);
  await fs.emptyDir(pathRelease);
  await fs.ensureDir(pathReleaseOutputDist);
  // 拷贝dist
  await fs.copy(pathDist, pathReleaseOutputDist);
  // 清空runtime
  await fs.emptyDir(pathReleaseOutputDistRuntime);
  // 清空env
  await fs.writeFile(pathReleaseOutputDistEnv, '');
  // 拷贝overwrite
  await fs.copy(pathOverwrite, pathReleaseOutput);
  // 压缩
  console.log('Generating compressed package...');
  await zip(pathReleaseOutput, pathArchive);
  console.log(`Packaging complete, directory: ${pathRelease}`);
}

main();
