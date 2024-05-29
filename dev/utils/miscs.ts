import { spawn } from 'child_process';

export function executeCommand(command: string, cwd?: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const process = spawn(command, { shell: true, cwd, stdio: 'inherit' });
    process.on('close', (code) => {
      if (code !== 0) {
        reject(`Command exited with code ${code}`);
      } else {
        resolve('done');
      }
    });
  });
}
