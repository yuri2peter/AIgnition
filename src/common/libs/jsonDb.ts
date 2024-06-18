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

const { throttle } = lodash;

const backupPlanSchema = z.object({
  dir: z.string(), // 备份目录
  maxBackups: z.number().int().min(1), // 备份文件最大数量
  cronExp: z.string(), // 定时任务 cron 描述。如 "0 23 * * *" 表示每天23:00执行；"*/30 * * * *" 表示每隔30分钟执行一次。
});
// 备份计划
type BackupPlan = z.infer<typeof backupPlanSchema>;

// 版本修复器, 开发者可以在此处检查导入的record是否是最新版本, 如果不是,可以用changeData对其版本进行修复升级
export type DataVersionFixer<T, U = unknown> = (
  record: Record<U>,
  setData: (recipe: (base: U) => T) => void
) => void;

type DataLoadHandle<T> = (data: T) => void;

// 数据记录
interface Record<T> {
  data: T;
  version: number;
  updatedAtString: string;
  updatedAtTime: number;
}

export default class JsonDb<T> {
  readonly file: string = '';
  readonly version: number = 0;
  readonly debug: boolean = false;
  private data: T;
  private versionFixer: DataVersionFixer<T> = () => {};
  private onDataLoad: DataLoadHandle<T>;
  save: (immidiate?: boolean) => void = () => {};

  constructor(params: {
    file: string; // 数据文件
    defaultValue: T; // 默认值
    version?: number; // 版本号
    versionFixer?: DataVersionFixer<T>; // 版本修复器
    onDataLoad?: DataLoadHandle<T>; // 数据加载后对数据的额外操作（如初始化、完整性检查）
    saveThrottleDelay?: number; // 保存动作的延迟
    backup?: BackupPlan; // 备份计划
    debug?: boolean; // 是否开启调试
  }) {
    const {
      file,
      defaultValue,
      version = 1,
      versionFixer = () => {},
      onDataLoad = () => {},
      saveThrottleDelay = 1000,
      backup,
      debug,
    } = params;
    this.debug = !!debug;
    this.file = file;
    this.version = version;
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
    this.versionFixer = versionFixer;
    this.onDataLoad = onDataLoad;
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

  private loadFile(file?: string) {
    try {
      const content = fs.readFileSync(file || this.file, 'utf8');
      const record = JSON.parse(content) as Record<unknown>;
      this.importRecord(record);
    } catch (error) {
      console.log('[jsonDb] Error parsing db file, use default value.');
    }
    this.saveFile();
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

        // 写入文件
        const filePath = path.join(dir, `${timeStr}.json`);
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
          fs.unlink(path.join(dir, backupFileNames[index])).catch(() => {
            console.warn(
              '[jsonDb] Error deleting backup file ' + backupFileNames[index]
            );
          });
        }
      }
    );
  }

  private saveFile(file?: string) {
    const filePath = file || this.file;
    fs.ensureFileSync(filePath);
    fs.writeFileSync(filePath, JSON.stringify(this.exportRecord(), null, 2));
  }

  importRecord(record: Record<unknown>) {
    this.data = record.data as T;
    this.versionFixer(record, (recipe) => {
      this.set(recipe(this.data));
    });
    this.onDataLoad(this.data);
  }

  exportRecord(): Record<unknown> {
    return {
      version: this.version,
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
const dbBackUpDir = path.resolve('./data/db/main_backup');

export const db = new JsonDb({
  file: dbFile,
  backup: {
    dir: dbBackUpDir,
    cronExp: '*/30 * * * *',
    maxBackups: 150,
  },
  version: 1,
  defaultValue: { hello: 'world' },
  debug: true,
  versionFixer: () => {},
});

=================
  `);
  }
}
