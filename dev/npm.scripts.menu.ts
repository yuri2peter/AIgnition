import inquirer from 'inquirer';
import { executeCommand } from './utils/miscs';

const scripts = [
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
];

inquirer
  .prompt({
    type: 'rawlist',
    name: 'script',
    loop: false,
    pageSize: 20,
    message: 'Please select execute command',
    choices: scripts.map((t) => ({
      name: `${t.name} (${t.value})`,
      value: t.value,
    })),
  })
  .then(({ script }) => {
    if (script) {
      const cmd = `npm run ${script}`;
      console.log(`Execute: ${cmd}`);
      executeCommand(cmd).catch(console.error);
    }
  });
