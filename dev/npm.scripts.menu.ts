import inquirer from 'inquirer';
import { executeCommand } from './utils/miscs';
import { USE_ELECTRON } from '../src/common/config';

const scripts = USE_ELECTRON
  ? [
      {
        name: 'Run in development mode',
        value: 'start:electron',
      },
      {
        name: 'Run in production mode',
        value: 'prod:electron',
      },
      {
        name: 'Syntax check',
        value: 'lint',
      },
      {
        name: 'Package electron application',
        value: 'package:electron',
      },
      {
        name: 'Package current project files',
        value: 'package:project',
      },
    ]
  : [
      {
        name: 'Run in development mode',
        value: 'start:node',
      },
      {
        name: 'Run in production mode',
        value: 'prod:node',
      },
      {
        name: 'Syntax check',
        value: 'lint',
      },
      {
        name: 'Package regular application',
        value: 'package:regular',
      },
      {
        name: 'Package docker image',
        value: 'package:docker',
      },
      {
        name: 'Package portable nodejs application',
        value: 'package:protable',
      },
      {
        name: 'Package current project files',
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
