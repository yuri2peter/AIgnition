import fs from 'fs-extra';
import { CachePersistDriver, Storage } from './MemCache';
import { throttle } from 'lodash';

export default function createMemCacheFilePersistDriver(
  filePath: string
): CachePersistDriver {
  const load = () => {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(content) as Storage;
    } catch (error) {
      return {};
    }
  };
  const onStorageChange = (storage: Storage) => {
    try {
      fs.ensureFileSync(filePath);
      fs.writeFileSync(filePath, JSON.stringify(storage, null, 2));
    } catch (error) {
      console.warn(error);
      //
    }
  };
  return {
    load,
    onStorageChange: throttle(onStorageChange, 2000, {
      leading: true,
      trailing: true,
    }),
  };
}
