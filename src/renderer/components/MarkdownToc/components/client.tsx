import * as React from 'react';
import { Fragment, useContext, useEffect, useState } from 'react';
import { throttle } from 'lodash';
import type { Result } from 'mdast-util-toc';

import type { ItemType } from '../from-markdown';

function findClosestElement(
  elements: Element[],
  center: number
): Element | null {
  let closestElement: Element | null = null;
  let smallestDistanceToCenter = Infinity;

  elements.forEach((element) => {
    const rect = element.getBoundingClientRect();
    const elementCenter = rect.top + rect.height / 2;
    const distanceToCenter = Math.abs(center - elementCenter);
    if (distanceToCenter < smallestDistanceToCenter) {
      smallestDistanceToCenter = distanceToCenter;
      closestElement = element;
    }
  });

  return closestElement;
}

const context = React.createContext<string>('');

export type ScrollAlign = 'start' | 'center' | 'end';

export interface TOCProviderProps {
  scrollAlign?: ScrollAlign;
  throttleTime?: number;
  keyMap: Map<string, string>;
  children: React.ReactNode;
  dom?: Element; // Makrdown preview dom, default: document.body
}

export const TOCProvider = (props: TOCProviderProps) => {
  const { children, keyMap, scrollAlign, throttleTime = 1000, dom } = props;
  const [state, setState] = useState<string>('');
  const previewDom = dom ?? document.body;
  useEffect(() => {
    const setActiveKey = throttle(() => {
      const viewportHeight = previewDom.clientHeight;
      const totalScrollTop = previewDom.scrollHeight;
      const currentScrollTop = previewDom.scrollTop;
      let centerForEle: number;
      if (currentScrollTop < viewportHeight) {
        centerForEle = 0;
      } else if (currentScrollTop + viewportHeight > totalScrollTop) {
        centerForEle = viewportHeight;
      } else {
        const viewportCenter = viewportHeight / 2;
        centerForEle =
          scrollAlign === 'start'
            ? 0
            : scrollAlign === 'end'
              ? viewportHeight
              : viewportCenter;
      }
      const elements = Array.from(
        previewDom.querySelectorAll(
          'h1[id], h2[id], h3[id], h4[id], h5[id], h6[id]'
        )
      );
      const previewDomRect = previewDom.getBoundingClientRect();
      const element = findClosestElement(
        elements,
        centerForEle + previewDomRect.top
      );
      const activeId = element?.getAttribute('id');
      if (activeId) {
        const activeKey = keyMap.get(`#${activeId}`);
        if (activeKey) {
          setState(activeKey);
        }
      }
    }, throttleTime);

    previewDom.addEventListener('scroll', setActiveKey);
    previewDom.addEventListener('hashchange', setActiveKey);

    return () => {
      previewDom.removeEventListener('scroll', setActiveKey);
      previewDom.removeEventListener('hashchange', setActiveKey);
    };
  }, [keyMap, scrollAlign, throttleTime, previewDom]);

  return <context.Provider value={state}>{children}</context.Provider>;
};

export interface LinkProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  activeKey: string;
  scrollAlign: ScrollAlign;
}

export const Link = (props: LinkProps) => {
  const { activeKey, scrollAlign, ...rest } = props;
  const currentKey = useContext(context);
  return (
    <a
      data-active={currentKey === activeKey}
      {...rest}
      onClick={(e) => {
        e.preventDefault();
        window.history.pushState(null, '', props.href);
        const id = props.href!.slice(1);
        const target = document.getElementById(id);
        target?.scrollIntoView({ behavior: 'smooth', block: scrollAlign });
      }}
    />
  );
};

export interface TOCProps {
  toc: readonly [Result, Map<string, string>];
  scrollAlign?: ScrollAlign;
  throttleTime?: number;
  dom?: Element;
  renderList: RenderProps;
  renderListItem: RenderProps;
  renderLink: (
    children: React.ReactNode,
    url: string,
    active: boolean
  ) => React.ReactNode;
}

type RenderProps = (
  children: React.ReactNode,
  active: boolean
) => React.ReactNode;

export const TOC = (props: TOCProps) => {
  const {
    scrollAlign,
    throttleTime,
    toc: [result, keyMap],
    renderList,
    renderListItem,
    renderLink,
    dom,
  } = props;

  function render(item: ItemType) {
    let renderFn: RenderProps | null = null;
    if (item.type === 'list') {
      renderFn = renderList;
    } else if (item.type === 'listItem') {
      renderFn = renderListItem;
    } else if (item.type === 'link') {
      renderFn = (children, active) => renderLink(children, item.url, active);
    } else if (item.type === 'text') {
      return item.value;
    }
    // `item.children` could be undefined sometimes
    if (renderFn) {
      return (
        <TOCImplRender key={item.key} activeKey={item.key} render={renderFn}>
          {(item.children ?? []).map((child) => render(child as ItemType))}
        </TOCImplRender>
      );
    }

    return (
      <Fragment key={item.key}>
        {(item.children ?? []).map((child) => render(child as ItemType))}
      </Fragment>
    );
  }

  return (
    <TOCProvider
      throttleTime={throttleTime}
      scrollAlign={scrollAlign}
      keyMap={keyMap}
      dom={dom}
    >
      {result.map?.children.map((child) => render(child))}
    </TOCProvider>
  );
};

interface TOCImplRenderProps {
  activeKey: string;
  render: RenderProps;
  children: React.ReactNode;
}

function TOCImplRender(props: TOCImplRenderProps) {
  const { activeKey, render, children } = props;
  const currentKey = useContext(context);
  const active = currentKey.startsWith(activeKey);
  return render(children, active);
}
