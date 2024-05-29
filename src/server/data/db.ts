import path from 'path';
import JsonDb from 'src/common/libs/jsonDb';
import { runtimeDataPath } from 'src/common/paths.app';
import { version, DataSchema, defaultValue } from 'src/common/type/data';
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

    if (record.version !== version) {
      consoleLog(
        `Data schema version ${record.version} should be ${version}.`,
        'db'
      );
      // try fixing
      setData((d) => DataSchema.parse(d));
      consoleLog('Data schema version fixed.', 'db');
    }
  },
});
consoleLog('Database initialized.', 'db');
export default function db() {
  return dbInstance;
}
