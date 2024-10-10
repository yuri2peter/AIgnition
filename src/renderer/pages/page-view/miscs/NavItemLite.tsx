import clsx from 'clsx';
import React, { PropsWithoutRef } from 'react';
import { Link } from 'react-router-dom';
import { ComputedPage } from 'src/common/type/page';
import { getPageRoute, getPageTitleFixed } from 'src/renderer/helpers/miscs';

const NavItemLite: React.FC<{
  item: ComputedPage;
  selected?: boolean;
  buttonProps?: PropsWithoutRef<JSX.IntrinsicElements['button']>;
}> = ({ item, selected, buttonProps }) => {
  return (
    <li className="rct-tree-item-li">
      <Link
        to={getPageRoute(item.id)}
        onClick={(e) => {
          e.preventDefault();
        }}
      >
        <div
          className={clsx('rct-tree-item-title-container', {
            'rct-tree-item-title-container-selected': selected,
          })}
        >
          <button
            style={{
              marginLeft: 0,
              paddingLeft: 8,
            }}
            className={clsx('rct-tree-item-button before:left-0', {
              'rct-tree-item-button-selected': selected,
            })}
            {...buttonProps}
          >
            <p
              className="rct-tree-item-title"
              title={getPageTitleFixed(item.title)}
            >
              {getPageTitleFixed(item.title)}
            </p>
            {item.isPublicFolder && <span title="Public folder">🌐</span>}
            {item.isFavorite && <span title="Favorite">⭐</span>}
          </button>
        </div>
      </Link>
    </li>
  );
};

export default NavItemLite;
