import { DataParsed } from './dataParser';
import { ROOT_PAGE_ID } from 'src/common/type/page';
import { formatTime } from 'src/common/utils/time';
import { usePageStore } from 'src/renderer/store/usePageStore';
import { emitEventReloadTree } from '../../PageNav/events';

export async function dataInsert(dataParsed: DataParsed) {
  const createPage = usePageStore.getState().actions.createPage;
  // create root
  const rootTitle = `Jotway (${formatTime()})`;
  const rootId = await createPage({
    item: {
      title: rootTitle,
      content: `# ${rootTitle}\n\n`,
      isFolder: true,
    },
    parent: ROOT_PAGE_ID,
  });

  // create dirs
  for (const dir of dataParsed) {
    // dir parent page
    const dirId = await createPage({
      item: {
        title: '📁 ' + dir.tag,
        content: `# 📁 ${dir.tag}\n\n`,
        isFolder: true,
      },
      parent: rootId,
    });

    await createPage({
      item: {
        title: '🔖 Bookmarks',
        content:
          '# 🔖 Bookmarks\n\n' +
          dir.linkers
            .filter((t) => !t.article)
            .map(
              (t) => `- [${t.name} | ${t.desc.replace(/\n/g, '. ')}](${t.url})`
            )
            .join('\n'),
      },
      parent: dirId,
      noEffects: true,
    });

    // article pages
    for (const article of dir.linkers.filter((t) => t.article)) {
      await createPage({
        item: {
          title: '📄 ' + article.name,
          content: article.content,
        },
        parent: dirId,
        noEffects: true,
      });
    }
  }

  emitEventReloadTree();
}
