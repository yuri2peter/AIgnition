import path from 'path';
import JsonDb from 'src/common/libs/jsonDb';
import { runtimeDataPath } from 'src/common/paths.app';
import { DataSchema, defaultValue } from 'src/common/type/data';
import { Page, PageSchema, ROOT_PAGE_ID } from 'src/common/type/page';
import { consoleLog } from 'src/common/utils/dev';

const dbInstance = new JsonDb({
  encode: true,
  file: path.resolve(runtimeDataPath, 'db/main.db'),
  backup: {
    dir: path.resolve(runtimeDataPath, 'db/main_backup'),
    cronExp: '*/30 * * * *',
    maxBackups: 3,
  },
  defaultValue,
  onLoad: (get, set) => {
    // Schema fix
    set(DataSchema.parse(get()));
    const data = get();
    // root page must exist
    if (!data.pages.find((t) => t.id === ROOT_PAGE_ID)) {
      data.pages.push(getDefaultRootPage());
    }
  },
});
consoleLog('Database initialized.', 'db');
export default function db() {
  return dbInstance;
}

export function getDefaultRootPage() {
  const defaultRootPageData: Partial<Page> = {
    id: ROOT_PAGE_ID,
    title: 'Welcome',
    isFolder: true,
    content: `# 😺Welcome

![image](https://github.com/yuri2peter/picx-images-hosting/raw/master/logo_banner.2h89fgamei.webp)

<h3 align="center">
---- Notes that spark your creativity.
</h3>

## 💡 Introduction

**AIgnition** is an intuitive, open-source note-taking web app, powered by AI to simplify and enhance your note-taking experience.

## 🚀 Quick Start

See more in the  [Documentation](https://github.com/yuri2peter/AIgnition).`,
  };
  return PageSchema.parse(defaultRootPageData);
}
