import dayjs from 'dayjs';
import { IS_DEV } from '../config';

export function consoleLog(message: string, sectionName = 'info') {
  const timeStr = dayjs().format('YYYY-MM-DD HH:mm:ss');
  console.log(`[${timeStr}] [${sectionName}] ${message}`);
}

export function debugLog(message: string, sectionName = 'debgug') {
  if (IS_DEV) {
    consoleLog(message, sectionName);
  }
}
