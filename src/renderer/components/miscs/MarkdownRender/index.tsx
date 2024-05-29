import React from 'react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import theme1 from './theme1.module.css';

const themeClasses: Record<string, string> = {
  theme1: theme1.root,
};

const MarkdownRender: React.FC<{ text: string; theme?: string }> = ({
  text,
  theme = 'theme1',
}) => {
  return (
    <Markdown remarkPlugins={[remarkGfm]} className={themeClasses[theme]}>
      {text}
    </Markdown>
  );
};

export default MarkdownRender;
