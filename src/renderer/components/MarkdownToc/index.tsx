import { Anchor, Text } from '@mantine/core';
import React from 'react';
import scrollIntoView from 'smooth-scroll-into-view-if-needed';
import { fromMarkdown } from './from-markdown';
import { TOC } from './components/client';

const MarkdownToc: React.FC<{
  markdown: string;
  getTocSourceDom?: () => Element | null;
}> = ({ markdown, getTocSourceDom }) => {
  const toc = fromMarkdown(markdown);
  const dom = getTocSourceDom?.() || document.body;
  if (toc[1].size === 0)
    return (
      <Text size="sm" c="gray">
        Not available.
      </Text>
    );
  return (
    <ul
      className="prose prose-sm prose-li:ps-0"
      style={{ listStyle: 'none', paddingLeft: 0 }}
    >
      <TOC
        throttleTime={20}
        dom={dom}
        toc={toc}
        scrollAlign="center"
        renderList={(children) => <ul>{children}</ul>}
        renderListItem={(children) => <li>{children}</li>}
        renderLink={(children, href, active) => (
          <Anchor
            c={active ? 'blue' : 'gray'}
            data-active={active}
            role="button"
            href={href}
            onClick={(e) => {
              e.preventDefault();
              const target = document.querySelector(href);
              if (target) {
                scrollIntoView(target, { behavior: 'smooth' });
              }
            }}
          >
            <Text size="sm" fw={500}>
              {children}
            </Text>
          </Anchor>
        )}
      />
    </ul>
  );
};

export default React.memo(MarkdownToc);
