import path from 'path';
import fs from 'fs-extra';
import extract from 'extract-zip';
import { zip } from 'zip-a-folder';

const downloadLink =
  'https://github.com/yuri2peter/node-app-portable/releases/download/1.1.0/output.zip';

const pathDist = path.resolve(__dirname, '../../dist');
const pathTemplate = path.resolve(__dirname, 'template');
const pathTemplateOutputZip = path.resolve(pathTemplate, 'output.zip');
const pathRelease = path.resolve(__dirname, 'release');
const pathOutput = path.resolve(pathRelease, 'output');
const pathArchive = path.resolve(pathRelease, 'archive.zip');
const pathOutputDist = path.resolve(pathOutput, 'app/dist');
const pathOutputDistRuntime = path.resolve(pathOutputDist, 'runtime');
const pathOutputDistEnv = path.resolve(pathOutputDist, '.env');
const pathOverwrite = path.resolve(__dirname, 'overwrite');

async function main() {
  console.log('打包便携式nodejs应用');
  // 准备环境
  await fs.ensureDir(pathTemplate);
  if (!fs.existsSync(pathTemplateOutputZip)) {
    console.log(
      `本地模板文件缺失，请手动前往\n${downloadLink}\n下载并保存至 ${pathTemplateOutputZip}\n完成后，请重新执行此脚本。`
    );
    return;
  }
  // 准备目录
  await fs.ensureDir(pathRelease);
  await fs.emptyDir(pathRelease);
  await extract(pathTemplateOutputZip, { dir: pathRelease });
  // 拷贝dist
  await fs.emptyDir(pathOutputDist);
  await fs.copy(pathDist, pathOutputDist);
  // 清空runtime
  await fs.emptyDir(pathOutputDistRuntime);
  // 清空env
  await fs.writeFile(pathOutputDistEnv, '');
  // 拷贝overwrite
  await fs.copy(pathOverwrite, pathOutput);
  // 压缩
  console.log('正在生成压缩包');
  await zip(pathOutput, pathArchive);
  console.log(`打包完成，目录：${pathRelease}`);
}

main();
