import { cloneDeep } from 'lodash';
import {
  TreeDataProvider,
  TreeItem,
  TreeItemIndex,
  Disposable,
} from 'react-complex-tree';

export default class CustomDataProvider<T> implements TreeDataProvider {
  private treeData: Record<TreeItemIndex, TreeItem<T>> = {};
  private treeChangeListeners: ((changedItemIds: TreeItemIndex[]) => void)[] =
    [];
  private onItemChildrenChange: (
    itemId: TreeItemIndex,
    newChildren: TreeItemIndex[]
  ) => void = () => {};

  constructor({
    onItemChildrenChange = () => {},
  }: {
    onItemChildrenChange?: (
      itemId: TreeItemIndex,
      newChildren: TreeItemIndex[]
    ) => void;
  }) {
    this.onItemChildrenChange = onItemChildrenChange;
  }

  public async getTreeItem(itemId: TreeItemIndex) {
    return this.treeData[itemId]!;
  }

  public getTreeItemsAsArray() {
    return Object.values(this.treeData);
  }

  public async onChangeItemChildren(
    itemId: TreeItemIndex,
    newChildren: TreeItemIndex[]
  ) {
    this.treeData[itemId]!.children = newChildren;
    this.emitDidChangeTreeData([itemId]);
    this.onItemChildrenChange(itemId, newChildren);
  }

  public onDidChangeTreeData(
    listener: (changedItemIds: TreeItemIndex[]) => void
  ): Disposable {
    this.treeChangeListeners.push(listener);
    return {
      dispose: () =>
        this.treeChangeListeners.splice(
          this.treeChangeListeners.indexOf(listener),
          1
        ),
    };
  }

  public updateDataSource(treeData: Record<TreeItemIndex, TreeItem<T>>) {
    this.treeData = cloneDeep(treeData);
  }

  public emitDidChangeTreeData(changedItemIds: TreeItemIndex[]) {
    this.treeChangeListeners.forEach((listener) => listener(changedItemIds));
  }
}
