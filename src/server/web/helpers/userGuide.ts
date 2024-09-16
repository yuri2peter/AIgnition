import fs from 'fs-extra';
import md5 from 'md5';
import path from 'path';
import { userGuidePath } from 'src/common/paths.app';
import { Data } from 'src/common/type/data';
import { Page, PageSchema, ROOT_PAGE_ID } from 'src/common/type/page';
import { deleteNode } from 'src/common/utils/tree';

const userGuidePageId = 'aignition-user-guide';

export function recreateUserGuide(data: Data) {
  const previousGuidePage = data.pages.find(
    (item) => item.id === userGuidePageId
  );
  if (previousGuidePage) {
    data.pages = deleteNode(data.pages, previousGuidePage);
  }
  const { pages } = data;

  const rootPage = pages.find((item) => item.id === ROOT_PAGE_ID)!;
  // create user guide page
  const userGuidePage: Page = PageSchema.parse({
    id: userGuidePageId,
    title: '📘 AIgnition User Guide',
    content: '# 📘 AIgnition User Guide\n\n',
    isFolder: true,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  });
  pages.push(userGuidePage);
  rootPage.children.push(userGuidePageId);

  // create sub pages
  const traversal = ({ dir, parentId }: { dir: string; parentId: string }) => {
    const subs = fs.readdirSync(path.join(userGuidePath, dir));
    const parentPage = pages.find((item) => item.id === parentId)!;
    for (const sub of subs) {
      const newPageId = md5(path.join(dir, sub)).substring(0, 6);
      const titleReg = /^[\d.]+\s(.+)(\.md)?$/;
      const title = titleReg.exec(sub)![1];
      const newPage: Page = PageSchema.parse({
        id: newPageId,
        title,
        content: `# ${title}\n\n`,
        isFolder: false,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
      pages.push(newPage);
      parentPage.children.push(newPageId);
      // if is dir
      if (fs.statSync(path.join(userGuidePath, dir, sub)).isDirectory()) {
        newPage.isFolder = true;
        traversal({ dir: path.join(dir, sub), parentId: newPageId });
      } else {
        newPage.content = fs.readFileSync(
          path.join(userGuidePath, dir, sub),
          'utf-8'
        );
      }
    }
  };

  traversal({ dir: '', parentId: userGuidePageId });
}
