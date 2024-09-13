/**
 * A simple database based json file.
 * @author yuri2peter
 */
import dayjs from 'dayjs';
import { Cron } from 'croner';
import fs from 'fs-extra';
import lodash from 'lodash';
import { z } from 'zod';
import path from 'path';
import { decode, encode } from 'js-base64';
import { getFileExtension } from '../utils/string';

const { throttle } = lodash;

const backupPlanSchema = z.object({
  dir: z.string(), // 备份目录
  maxBackups: z.number().int().min(1), // 备份文件最大数量
  cronExp: z.string(), // 定时任务 cron 描述。如 "0 23 * * *" 表示每天23:00执行；"*/30 * * * *" 表示每隔30分钟执行一次。
});
// 备份计划
type BackupPlan = z.infer<typeof backupPlanSchema>;

type DataLoadHandle<T> = (get: () => T, set: (data: T) => void) => void;

// 数据记录
interface Record<T> {
  data: T;
  updatedAtString: string;
  updatedAtTime: number;
}

export default class JsonDb<T> {
  readonly file: string = '';
  readonly debug: boolean = false;
  readonly encode: boolean = false;
  private data: T;
  private onLoad: DataLoadHandle<T>;
  save: (immidiate?: boolean) => void = () => {};

  constructor(params: {
    file: string; // 数据文件
    defaultValue: T; // 默认值
    onLoad?: DataLoadHandle<T>; // 数据加载后对数据的额外操作（如初始化、完整性检查）
    saveThrottleDelay?: number; // 保存动作的延迟
    backup?: BackupPlan; // 备份计划
    debug?: boolean; // 是否开启调试
    encode?: boolean; // 是否启用 base64 编码
  }) {
    const {
      file,
      defaultValue,
      onLoad = () => {},
      saveThrottleDelay = 1000,
      backup,
      debug,
      encode,
    } = params;
    this.debug = !!debug;
    this.encode = !!encode;
    this.file = file;
    this.data = defaultValue;
    const saveThrottle = throttle(() => {
      this.saveFile();
    }, saveThrottleDelay);
    this.save = (immidiate = false) => {
      if (immidiate) {
        this.saveFile();
      } else {
        saveThrottle();
      }
    };
    this.onLoad = onLoad;
    this.handleOnLoad();
    this.loadFile();
    this.startBackupPlan(backup);
  }

  get() {
    return this.data;
  }

  set(data: T) {
    this.data = data;
    this.save(true);
  }

  loadFile() {
    try {
      let content = fs.readFileSync(this.file, 'utf8');
      if (this.encode) {
        content = decode(content);
      }
      const record = JSON.parse(content) as Record<unknown>;
      this.importRecord(record);
    } catch (error) {
      console.log('[jsonDb] Error parsing db file, use default value.');
    }
    this.saveFile();
  }

  private handleOnLoad() {
    try {
      this.onLoad(
        () => this.data,
        (newData: T) => {
          this.data = newData;
        }
      );
    } catch (error) {
      console.error('[jsonDb] onLoad error:', error);
    }
  }

  private startBackupPlan(backup?: BackupPlan) {
    if (!backup) {
      return;
    }
    backupPlanSchema.parse(backup);
    const { dir, maxBackups, cronExp } = backup;
    Cron(
      cronExp,
      {
        name: 'jsonDb_backup',
      },
      () => {
        // 获取时间字符串
        const timeStr = dayjs().format('YYYY-MM-DD HH-mm'); // windows不允许:作为文件名
        if (this.debug) {
          console.log(`[jsonDb] Backup at ${timeStr}.`);
        }

        const ext = getFileExtension(this.file);

        // 写入文件
        const filePath = path.join(dir, `${timeStr}${ext ? `.${ext}` : ''}`);
        this.saveFile(filePath);

        // 删除超限的备份
        fs.ensureDirSync(dir);
        const backupFileNames: string[] = [];
        fs.readdirSync(dir).forEach((file) => {
          if (file.endsWith('.json')) {
            backupFileNames.push(file);
          }
        });
        // 把文件名按时间排序（旧->新）
        backupFileNames.sort((a, b) => {
          const getDateStr = (s: string) => {
            const reg = /^(.*)\.json$/;
            const execRel = reg.exec(s);
            return execRel ? execRel[1] : '';
          };
          return dayjs(getDateStr(a)).diff(dayjs(getDateStr(b)));
        });
        // 对超过上限的文件进行删除
        for (
          let index = 0;
          index < backupFileNames.length - maxBackups;
          index++
        ) {
          fs.unlink(path.join(dir, backupFileNames[index]!)).catch(() => {
            console.warn(
              '[jsonDb] Error occurred when deleting backup file ' +
                backupFileNames[index]
            );
          });
        }
      }
    );
  }

  private saveFile(file?: string) {
    const filePath = file || this.file;
    fs.ensureFileSync(filePath);
    let content = JSON.stringify(this.exportRecord(), null, 2);
    if (this.encode) {
      content = encode(content);
    }
    fs.writeFileSync(filePath, content);
  }

  importRecord(record: Record<unknown>) {
    this.data = record.data as T;
    this.handleOnLoad();
  }

  exportRecord(): Record<unknown> {
    return {
      updatedAtString: new Date().toString(),
      updatedAtTime: new Date().getTime(),
      data: this.data,
    };
  }

  showHelp() {
    console.log(`
=====EXAMPLE=====

import path from 'path';
import JsonDb from './libs/jsonDb';

const dbFile = path.resolve('./data/db/main.json');
const dbBackUpDir = path.resolve('./data/db/main_backups');

export const db = new JsonDb({
  file: dbFile,
  backup: {
    dir: dbBackUpDir,
    cronExp: '*/30 * * * *',
    maxBackups: 150,
  },
  defaultValue: { hello: 'world' },
  debug: true,
  onLoad: (get, set) => {
    // Schema fix
    set(DataSchema.parse(get()));
    const data = get();
    // Other fixes...
  },
});

=================
  `);
  }
}
