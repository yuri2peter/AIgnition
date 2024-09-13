import { HTMLProps } from 'react';
import {
  InteractionMode,
  InteractionManager,
  TreeItem,
  TreeItemActions,
  TreeItemRenderFlags,
} from 'react-complex-tree';

export class CustomInteractionManager implements InteractionManager {
  public readonly mode = InteractionMode.ClickItemToExpand;

  createInteractiveElementProps(
    item: TreeItem,
    treeId: string,
    actions: TreeItemActions,
    renderFlags: TreeItemRenderFlags
  ): HTMLProps<HTMLElement> {
    return {
      onClick: (e) => {
        actions.focusItem();
        if (e.shiftKey) {
          actions.selectUpTo(!isControlKey(e));
        } else if (isControlKey(e)) {
          if (renderFlags.isSelected) {
            actions.unselectItem();
          } else {
            actions.addToSelectedItems();
          }
        } else {
          if (item.isFolder) {
            actions.toggleExpandedState();
            if (!renderFlags.isExpanded) {
              actions.primaryAction();
            }
          } else {
            actions.primaryAction();
          }
          actions.selectItem();
        }
      },
      onFocus: () => {
        actions.focusItem();
      },
      onDragStart: (e) => {
        e.dataTransfer.dropEffect = 'move';
        actions.startDragging();
      },
      onDragOver: (e) => {
        e.preventDefault(); // Allow drop
      },
      draggable: renderFlags.canDrag && !renderFlags.isRenaming,
      tabIndex: !renderFlags.isRenaming
        ? renderFlags.isFocused
          ? 0
          : -1
        : undefined,
    };
  }
}

export const isControlKey = (e: React.MouseEvent<any, any>) =>
  e.ctrlKey ||
  (navigator.platform.toUpperCase().indexOf('MAC') >= 0 && e.metaKey);
