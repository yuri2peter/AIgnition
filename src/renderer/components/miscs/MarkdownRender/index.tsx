/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import MarkdownPreview from '@uiw/react-markdown-preview';
import rehypeExternalLinks from 'rehype-external-links';
import remarkGfm from 'remark-gfm';
import clsx from 'clsx';
import themeBase from './base.module.css';
import themeTiny from './tiny.module.css';
import themeDefault from './default.module.css';
import { Image } from '@mantine/core';
import CustomLink from './CustomLink';
import { Components } from 'react-markdown';
import CustomPre from './CustomPre';

const themeClasses: Record<string, string> = {
  tiny: themeTiny.root!,
  default: themeDefault.root!,
};

const components: Partial<Components> = {
  a: ({ ref, ...props }) => {
    return <CustomLink {...props} />;
  },
  img: ({ ref, ...props }) => {
    return (
      <Image
        {...props}
        w="auto"
        fit="contain"
        style={{ borderRadius: '0.375rem' }}
        fallbackSrc="/assets/icons/image_error.png"
      />
    );
  },
  pre: ({ className, children }) => {
    return <CustomPre className={className} children={children} showMaximize />;
  },
};

const MarkdownRender: React.FC<
  { text: string; theme?: string; dark?: boolean } & React.ComponentProps<
    typeof MarkdownPreview
  >
> = ({ text, theme = 'default', className, dark = false, ...otherProps }) => {
  return (
    <MarkdownPreview
      {...otherProps}
      source={text}
      rehypePlugins={[[rehypeExternalLinks, { target: '_blank' }]]}
      remarkPlugins={[remarkGfm]}
      disableCopy
      rehypeRewrite={(node, index, parent) => {
        if (
          // @ts-ignore
          node.tagName === 'a' &&
          parent &&
          // @ts-ignore
          /^h(1|2|3|4|5|6)/.test(parent.tagName)
        ) {
          parent.children = parent.children.slice(1);
        }
      }}
      components={components}
      className={clsx(
        className,
        themeClasses[theme],
        themeBase.root,
        'prism-highlight prism-highlight-dark',
        'prose',
        { 'prose-sm': theme === 'tiny' },
        { 'prose-invert': dark },
        'prose-del:text-gray-300',
        'prose-img:rounded-md',
        'prose-img:mx-auto',
        'prose-img:shadow-sm',
        'prose-code:text-sm',
        'prose-th:text-left',
        'prose-a:text-blue-800',
        'prose-a:no-underline',
        'prose-a:break-all',
        'hover:prose-a:underline',
        'prose-blockquote:text-green-600',
        'prose-blockquote:border-green-600'
      )}
    />
  );
};

export default React.memo(MarkdownRender);
