import React from 'react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import clsx from 'clsx';
import theme1 from './theme1.module.css';

const themeClasses: Record<string, string> = {
  theme1: theme1.root,
};

const MarkdownRender: React.FC<{ text: string; theme?: string }> = ({
  text,
  theme = 'theme1',
}) => {
  return (
    <Markdown
      components={{
        a: ({ href, children }) => (
          <a href={href} target="_blank" rel="noopener noreferrer">
            {children}
          </a>
        ),
      }}
      remarkPlugins={[remarkGfm]}
      className={clsx(themeClasses[theme], 'prose')}
    >
      {text}
    </Markdown>
  );
};

export default MarkdownRender;