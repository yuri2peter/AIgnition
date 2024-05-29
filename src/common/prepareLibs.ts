import { enableMapSet } from 'immer';
import dayjs from 'dayjs';
import isLeapYear from 'dayjs/plugin/isLeapYear';
import relativeTime from 'dayjs/plugin/relativeTime';
import duration from 'dayjs/plugin/duration';
import 'dayjs/locale/zh-cn';

function prepareLibs() {
  dayjs.extend(relativeTime);
  dayjs.extend(duration);
  dayjs.extend(isLeapYear);
  // dayjs.locale('zh-cn');
  enableMapSet();
}
prepareLibs();
