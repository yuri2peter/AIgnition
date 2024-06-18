import path from 'path';
import JsonDb from 'src/common/libs/jsonDb';
import { runtimeDataPath } from 'src/common/paths.app';
import { version, DataSchema, defaultValue } from 'src/common/type/data';
import { PageSchema, ROOT_PAGE_ID } from 'src/common/type/page';
import { consoleLog } from 'src/common/utils/dev';

const dbInstance = new JsonDb({
  file: path.resolve(runtimeDataPath, 'db/main.json'),
  backup: {
    dir: path.resolve(runtimeDataPath, 'db/main_backup'),
    cronExp: '*/30 * * * *',
    maxBackups: 3,
  },
  version,
  defaultValue,
  versionFixer: (record, setData) => {
    // fix anyway
    setData((d) => DataSchema.parse(d));
    return;
  },
  onDataLoad: (data) => {
    // root page must exist
    if (!data.pages.find((t) => t.id === ROOT_PAGE_ID)) {
      data.pages.push(
        PageSchema.parse({
          id: ROOT_PAGE_ID,
          isPublic: true,
          createdAt: Date.now(),
        })
      );
    }
  },
});
consoleLog('Database initialized.', 'db');
export default function db() {
  return dbInstance;
}
