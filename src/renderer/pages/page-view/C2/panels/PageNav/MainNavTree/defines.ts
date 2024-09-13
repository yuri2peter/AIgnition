import { TreeItem } from 'react-complex-tree';
import { ComputedPage } from 'src/common/type/page';

export type MyTreeItem = TreeItem<ComputedPage> & { id: string };
