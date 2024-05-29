import path from 'path';
import fs from 'fs-extra';
import walk from 'ignore-walk';
import { zip } from 'zip-a-folder';

const rootPath = path.resolve(__dirname, '../../');
const pathRelease = path.resolve(__dirname, 'release');
const pathOutput = path.resolve(pathRelease, 'output');
const pathArchive = path.resolve(pathRelease, 'archive.zip');

async function main() {
  console.log('打包project');
  // 准备目录
  await fs.ensureDir(pathRelease);
  await fs.emptyDir(pathRelease);
  // 检索所有文件，忽略ignore和git
  const files1 = await walk({
    path: rootPath,
    ignoreFiles: ['.gitignore'],
    includeEmpty: true,
  });
  const files2 = files1.filter((f) => {
    return !f.startsWith('.git/');
  });
  // 拷贝至output
  files2.forEach((f) => {
    const fromPath = path.resolve(rootPath, f);
    const toPath = path.resolve(pathOutput, f);
    const isDir = fs.lstatSync(fromPath).isDirectory();
    if (!isDir) {
      fs.ensureFileSync(toPath);
      fs.copyFileSync(fromPath, toPath);
    }
  });
  console.log('正在生成压缩包');
  await zip(pathOutput, pathArchive);
  await fs.remove(pathOutput);
  console.log(`打包完成，目录：${pathRelease}`);
}

main();
