import React from 'react';
import {
  TreeInformation,
  TreeItem,
  TreeItemRenderContext,
} from 'react-complex-tree';
import { Link } from 'react-router-dom';
import { getPageRoute } from 'src/renderer/helpers/miscs';

const renderDepthOffset = 10;
const cx = (...classNames: Array<string | undefined | false>) =>
  classNames.filter((cn) => !!cn).join(' ');

type Props<T = any, C extends string = never> = {
  item: TreeItem<T>;
  depth: number;
  children: React.ReactNode | null;
  title: React.ReactNode;
  arrow: React.ReactNode;
  context: TreeItemRenderContext<C>;
  info: TreeInformation;
  loggedIn: boolean;
};

const CustomRenderItem = ({
  item,
  depth,
  children,
  title,
  context,
  arrow,
  loggedIn,
}: Props) => {
  const InteractiveComponent = context.isRenaming ? 'div' : 'button';
  const type = context.isRenaming ? undefined : 'button';
  return (
    <li
      {...(context.itemContainerWithChildrenProps as any)}
      className={cx(
        'rct-tree-item-li',
        item.isFolder && 'rct-tree-item-li-isFolder',
        context.isSelected && 'rct-tree-item-li-selected',
        context.isExpanded && 'rct-tree-item-li-expanded',
        context.isFocused && 'rct-tree-item-li-focused',
        context.isDraggingOver && 'rct-tree-item-li-dragging-over',
        context.isSearchMatching && 'rct-tree-item-li-search-match'
      )}
    >
      <Link
        to={getPageRoute(item.data.id)}
        onClick={(e) => {
          e.preventDefault();
        }}
      >
        <div
          {...(context.itemContainerWithoutChildrenProps as any)}
          style={{ '--depthOffset': `${(depth + 1) * renderDepthOffset}px` }}
          className={cx(
            'rct-tree-item-title-container',
            item.isFolder && 'rct-tree-item-title-container-isFolder',
            context.isSelected && 'rct-tree-item-title-container-selected',
            context.isExpanded && 'rct-tree-item-title-container-expanded',
            context.isFocused && 'rct-tree-item-title-container-focused',
            context.isDraggingOver &&
              'rct-tree-item-title-container-dragging-over',
            context.isSearchMatching &&
              'rct-tree-item-title-container-search-match'
          )}
        >
          {arrow}
          <InteractiveComponent
            type={type}
            {...(context.interactiveElementProps as any)}
            className={cx(
              'rct-tree-item-button',
              item.isFolder && 'rct-tree-item-button-isFolder',
              context.isSelected && 'rct-tree-item-button-selected',
              context.isExpanded && 'rct-tree-item-button-expanded',
              context.isFocused && 'rct-tree-item-button-focused',
              context.isDraggingOver && 'rct-tree-item-button-dragging-over',
              context.isSearchMatching && 'rct-tree-item-button-search-match',
              item.data?.isPublicFolder && 'rct-tree-item-button-public'
            )}
          >
            {/* <span>{item.isFolder ? '📁' : '📄'}</span> */}
            <p className="rct-tree-item-title" title={item.data?.title}>
              {title}
            </p>
            {loggedIn && item.data?.isPublicFolder && (
              <span title="Public folder">🌐</span>
            )}
            {loggedIn && item.data?.isFavorite && (
              <span title="Favorite">⭐</span>
            )}
          </InteractiveComponent>
        </div>
      </Link>
      {children}
    </li>
  );
};

export default CustomRenderItem;
