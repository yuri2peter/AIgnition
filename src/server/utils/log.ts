import fs from 'fs-extra';
import dayjs from 'dayjs';
import cfonts from 'cfonts';
import { runtimeServerLogPath } from 'src/common/paths.app';
import { PROJECT_NAME } from 'src/common/config';

export function fileLog(message: string, sectionName = 'info') {
  const timeStr = dayjs().format('YYYY-MM-DD HH:mm:ss');
  const msg = `[${timeStr}] [${sectionName}] ${message}`;
  console.log(msg);
  fs.appendFileSync(runtimeServerLogPath, `${msg}\n`, 'utf-8');
}

export async function showLargeTitle() {
  cfonts.say(PROJECT_NAME, {
    font: 'block',
    gradient: ['red', 'blue'],
  });
}
