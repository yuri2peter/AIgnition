import React, { useContext, useEffect } from 'react';
import { rehype } from 'rehype';
import rehypePrism from 'rehype-prism-plus';
import { IProps } from '../../Types';
import { EditorContext } from '../../Context';

function html2Escape(sHtml: string) {
  return (
    sHtml
      // .replace(/```(\w+)?([\s\S]*?)(\s.+)?```/g, (str: string) => {
      //   return str.replace(
      //     /[<&"]/g,
      //     (c: string) => (({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;' } as Record<string, string>)[c]),
      //   );
      // })
      .replace(
        /[<&"]/g,
        (c: string) =>
          (
            ({
              '<': '&lt;',
              '>': '&gt;',
              '&': '&amp;',
              '"': '&quot;',
            }) as Record<string, string>
          )[c]
      )
  );
}

export interface MarkdownProps
  extends IProps,
    React.HTMLAttributes<HTMLPreElement> {}

export default function Markdown(props: MarkdownProps) {
  const { prefixCls } = props;
  const { markdown = '', dispatch } = useContext(EditorContext);
  const preRef = React.createRef<HTMLPreElement>();
  useEffect(() => {
    if (preRef.current && dispatch) {
      dispatch({ textareaPre: preRef.current });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  if (!markdown) {
    return (
      <pre
        ref={preRef}
        className={`${prefixCls}-text-pre wmde-markdown-color`}
      />
    );
  }
  let mdStr = `<pre class="language-markdown ${prefixCls}-text-pre wmde-markdown-color"><code class="language-markdown">${html2Escape(
    String.raw`${markdown}`
  )}\n</code></pre>`;

  try {
    mdStr = rehype()
      .data('settings', { fragment: true })
      // https://github.com/uiwjs/react-md-editor/issues/593
      // @ts-ignore
      .use(rehypePrism, { ignoreMissing: true })
      .processSync(mdStr)
      .toString();
  } catch (error) {
    /* empty */
  }

  return React.createElement('div', {
    className: 'wmde-markdown-color',
    dangerouslySetInnerHTML: { __html: mdStr || '' },
  });
}
