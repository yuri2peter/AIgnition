import { DataParsed } from './dataParser';
import { ROOT_PAGE_ID } from 'src/common/type/page';
import { formatTime } from 'src/common/utils/time';
import { usePageStore } from 'src/renderer/store/usePageStore';
import { emitEventReloadTree } from '../../PageNav/events';

export async function dataInsert(dataParsed: DataParsed) {
  const createPage = usePageStore.getState().actions.createPage;
  // create root
  const rootTitle = `Jotway (${formatTime()})`;
  const rootId = await createPage(
    {
      title: rootTitle,
      content: `# ${rootTitle}\n\n`,
      isFolder: true,
    },
    ROOT_PAGE_ID,
    true
  );

  // create dirs
  for (const dir of dataParsed) {
    // dir parent page
    const dirId = await createPage(
      {
        title: dir.tag,
        content: `# ${dir.tag}\n\n`,
        isFolder: true,
      },
      rootId,
      true
    );

    await createPage(
      {
        title: 'Bookmarks',
        content:
          '# Bookmarks\n\n' +
          dir.linkers
            .filter((t) => !t.article)
            .map(
              (t) => `- [${t.name} | ${t.desc.replace(/\n/g, '. ')}](${t.url})`
            )
            .join('\n'),
      },
      dirId,
      true
    );

    // article pages
    for (const article of dir.linkers.filter((t) => t.article)) {
      await createPage(
        {
          title: article.name,
          content: article.content,
        },
        dirId,
        true
      );
    }

    emitEventReloadTree();
  }
}
