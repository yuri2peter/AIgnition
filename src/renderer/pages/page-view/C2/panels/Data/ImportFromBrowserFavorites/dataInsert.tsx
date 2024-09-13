import { ROOT_PAGE_ID } from 'src/common/type/page';
import { usePageStore } from 'src/renderer/store/usePageStore';
import { emitEventReloadTree } from '../../PageNav/events';
import { IBaseMark } from 'bookmark-file-parser';

export async function dataInsert(dataParsed: IBaseMark) {
  const createPage = usePageStore.getState().actions.createPage;
  const traversal = async (mark: IBaseMark, parentId = ROOT_PAGE_ID) => {
    const id = await createPage(
      {
        title: mark.name,
        content: `# ${mark.name}\n\n`,
        isFolder: true,
      },
      parentId,
      true
    );
    const bookmarks = mark.children.filter((t) => t.type === 'site');
    if (bookmarks.length > 0) {
      await createPage(
        {
          title: 'Bookmarks',
          content:
            '# Bookmarks\n\n' +
            bookmarks.map((t) => `- [${t.name}](${t.href})`).join('\n'),
        },
        id,
        true
      );
    }
    for (const subFolder of mark.children.filter((t) => t.type === 'folder')) {
      await traversal(subFolder, id);
    }
  };
  await traversal(dataParsed);
  emitEventReloadTree();
}
