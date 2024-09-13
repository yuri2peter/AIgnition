import { rehype } from 'rehype';
import rehypePrism from 'rehype-prism-plus';

export function html2Escape(sHtml: string) {
  return sHtml.replace(
    /[<&"]/g,
    (c: string) =>
      (
        ({
          '<': '&lt;',
          '>': '&gt;',
          '&': '&amp;',
          '"': '&quot;',
        }) as Record<string, string>
      )[c]!
  );
}

export function mdProcess1(md: string, prefixCls: string) {
  // Watch out the spaces in the string!
  return `<pre class="language-markdown
     ${prefixCls}-text-pre
      wmde-markdown-color"><code class="language-markdown">${html2Escape(
        String.raw`${md}`
      )}\n</code></pre>`;
}

export function mdProcess2(md: string, prefixCls: string) {
  const r1 = mdProcess1(md, prefixCls);
  return (
    rehype()
      .data('settings', { fragment: true })
      // https://github.com/uiwjs/react-md-editor/issues/593
      // @ts-ignore
      .use(rehypePrism, { ignoreMissing: true })
      .processSync(r1)
      .toString()
  );
}
