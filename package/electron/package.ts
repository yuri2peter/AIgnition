import path from 'path';
import { zip } from 'zip-a-folder';
import fs from 'fs-extra';
import { packager } from '@electron/packager';

export const IS_MAC = process.platform === 'darwin';
const pathDist = path.resolve(__dirname, '../../dist');
const pathRelease = path.resolve(__dirname, 'release');
const pathContext = path.resolve(__dirname, 'context');
const pathContextDist = path.resolve(pathContext, 'dist');
const pathContextDistRuntime = path.resolve(pathContextDist, 'runtime');
const pathContextDistEnv = path.resolve(pathContextDist, '.env');
const pathArchive = path.resolve(pathRelease, 'archive.zip');
const pathIcon = path.resolve(
  pathDist,
  'server/assets/icons',
  IS_MAC ? 'mac/icon.icns' : 'win/icon.ico'
);
const pathOverwrite = path.resolve(__dirname, 'overwrite');

async function main() {
  console.log('打包electron应用');
  // 准备目录
  await fs.ensureDir(pathRelease);
  await fs.emptyDir(pathRelease);
  await fs.ensureDir(pathContext);
  await fs.emptyDir(pathContext);
  // 准备context
  await fs.emptyDir(pathContextDist);
  await fs.copy(pathDist, pathContextDist);
  await fs.emptyDir(pathContextDistRuntime);
  await fs.writeFile(pathContextDistEnv, '');
  // 打包 (release/my-app-win32-x64)
  await packager({
    dir: pathContextDist,
    out: pathRelease,
    asar: false,
    icon: pathIcon, // win图标缓存可能会导致显示异常
    overwrite: true,
  });
  const files = await fs.readdir(pathRelease);
  const outputDir = path.resolve(pathRelease, files[0]);
  // 拷贝overwrite
  await fs.copy(pathOverwrite, outputDir);
  // 生成压缩包
  console.log('正在生成压缩包');
  await zip(outputDir, pathArchive);
  console.log(`打包完成，目录：${pathRelease}`);
}
main();
