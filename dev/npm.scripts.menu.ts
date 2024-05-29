import inquirer from 'inquirer';
import { executeCommand } from './utils/miscs';
import { USE_ELECTRON } from '../src/common/config';

const scripts = USE_ELECTRON
  ? [
      {
        name: '开发模式运行',
        value: 'start:electron',
      },
      {
        name: '生产模式运行',
        value: 'prod:electron',
      },
      {
        name: '语法检查',
        value: 'lint',
      },
      {
        name: '打包electron应用',
        value: 'package:electron',
      },
      {
        name: '打包当前项目文件',
        value: 'package:project',
      },
    ]
  : [
      {
        name: '开发模式运行',
        value: 'start:node',
      },
      {
        name: '生产模式运行',
        value: 'prod:node',
      },
      {
        name: '语法检查',
        value: 'lint',
      },
      {
        name: '打包常规应用',
        value: 'package:regular',
      },
      {
        name: '打包docker镜像',
        value: 'package:docker',
      },
      {
        name: '打包便携式nodejs应用',
        value: 'package:protable',
      },
      {
        name: '打包当前项目文件',
        value: 'package:project',
      },
    ];

inquirer
  .prompt({
    type: 'rawlist',
    name: 'script',
    loop: false,
    pageSize: 20,
    message: '请选择执行命令',
    choices: scripts.map((t) => ({
      name: `${t.name} (${t.value})`,
      value: t.value,
    })),
  })
  .then(({ script }) => {
    if (script) {
      const cmd = `npm run ${script}`;
      console.log(`执行命令: ${cmd}`);
      executeCommand(cmd).catch(console.error);
    }
  });
