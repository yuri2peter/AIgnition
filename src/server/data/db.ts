import path from 'path';
import JsonDb from 'src/common/libs/jsonDb';
import { runtimeDataPath } from 'src/common/paths.app';
import { Data, DataSchema, defaultValue } from 'src/common/type/data';
import {
  Page,
  PageSchema,
  ROOT_PAGE_ID,
  TRASH_PAGE_ID,
} from 'src/common/type/page';
import { consoleLog } from 'src/common/utils/dev';
import { recreateUserGuide } from '../web/helpers/userGuide';
import { shortId } from 'src/common/utils/string';

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

    // TODO: test only
    // createPRAR(data);

    // Initialize pages
    if (!data.pages.find((t) => t.id === ROOT_PAGE_ID)) {
      data.pages.push(getDefaultRootPage());
      recreateUserGuide(data);
      createPRAR(data);
    }

    // trash page must exist
    if (!data.pages.find((t) => t.id === TRASH_PAGE_ID)) {
      data.pages.push(getDefaultTrashPage());
      data.pages
        .find((t) => t.id === ROOT_PAGE_ID)!
        .children.unshift(TRASH_PAGE_ID);
    }

    data.pages.forEach((page) => {
      // No \r or nbsp
      page.content = page.content.replace(/\r/g, '').replace(/\u00A0/g, ' ');
      // experimental feature: Add 📁 or 📄 for existing page.
      // e.g. # Hello -> # 📄 Hello

      // if (!page.title.match(/^[^\s]{2}\s/)) {
      //   const icon = page.isFolder ? '📁' : '📄';
      //   page.title = `${icon} ${page.title}`;
      //   page.content = page.content.replace(/^#\s/, `# ${icon} `);
      // }
    });
  },
});
consoleLog('Database initialized.', 'db');
export default function db() {
  return dbInstance;
}

export function getDefaultRootPage() {
  const defaultRootPageData: Partial<Page> = {
    id: ROOT_PAGE_ID,
    title: '😺 Welcome',
    isFolder: true,
    content: `# 😺Welcome

![image](/assets/images/logo_banner.png)

<h3 align="center">
---- Notes that spark your creativity.
</h3>

## 💡 Introduction

**AIgnition** is an intuitive, open-source note-taking web app, powered by AI to simplify and enhance your note-taking experience.

 ![multi-mockup](/assets/images/logo_multi_mockup.png)

## 😉 Support the Project

[https://github.com/yuri2peter/AIgnition](https://github.com/yuri2peter/AIgnition#readme)

You can contribute to the project in several ways:

- **Star** the repository.
- **Fork** the repository.
- **Share** the project with your colleagues and peers.
- **Submit** issues and feature requests.
`,
  };
  return PageSchema.parse(defaultRootPageData);
}

export function getDefaultTrashPage() {
  const defaultTrashPageData: Partial<Page> = {
    id: TRASH_PAGE_ID,
    title: '🗑️ Trash Bin',
    isFolder: true,
    content: `# 🗑️ Trash Bin

This is the trash bin where deleted pages are temporarily stored. Pages in the trash bin can be restored or permanently deleted.

## How it works:

1. When you delete a page, it's moved here instead of being immediately erased.
2. You can manually restore pages from the trash bin if you change your mind.
3. To permanently delete a page, you can delete it from the trash bin.

## Tips:

- Regularly check your trash bin to ensure you haven't accidentally deleted important pages.
- When restoring a page, you'll need to manually specify its new location in your page hierarchy.
- Pages in the trash bin will remain there until you choose to restore or permanently delete them.

`,
  };
  return PageSchema.parse(defaultTrashPageData);
}

// https://fortelabs.com/blog/para/
export function createPRAR(data: Data) {
  const { pages } = data;
  const prar = [
    {
      id: shortId(),
      title: '📋 Project',
      isFolder: true,
      content:
        "# 📋 Project\n\nShort-term efforts in your work or life that you're working one now.",
    },
    {
      id: shortId(),
      title: '🔬 Area',
      isFolder: true,
      content:
        '# 🔬 Area\n\nLong-term responsibilities you want to manage over time.',
    },
    {
      id: shortId(),
      title: '🍭 Resources',
      isFolder: true,
      content:
        '# 🍭 Resources\n\nTopics or interests that may be useful in the future.',
    },
    {
      id: shortId(),
      title: '🗃️ Archive',
      isFolder: true,
      content:
        '# 🗃️ Archive\n\nInactive items from the orther three categories.',
    },
  ];
  pages.push(...prar.map((t) => PageSchema.parse(t)));
  pages
    .find((t) => t.id === ROOT_PAGE_ID)!
    .children.push(...prar.map((t) => t.id));
}
