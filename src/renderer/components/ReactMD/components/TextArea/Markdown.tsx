import React, { useContext, useEffect, useMemo, useState } from 'react';
import { IProps } from '../../Types';
import { EditorContext } from '../../Context';
import { mdProcess1, mdProcess2 } from '../../utils/textProcess';

export interface MarkdownProps
  extends IProps,
    React.HTMLAttributes<HTMLPreElement> {}

export default function Markdown(props: MarkdownProps) {
  const { prefixCls } = props;
  const { markdown, markdownLazy, dispatch } = useContext(EditorContext);
  const preRef = React.createRef<HTMLPreElement>();
  useEffect(() => {
    if (preRef.current && dispatch) {
      dispatch({ textareaPre: preRef.current });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const mdHtml = useMdHtml({
    value: markdown,
    lazyValue: markdownLazy,
    prefixCls,
  });

  return (
    <div
      className="wmde-markdown-color"
      dangerouslySetInnerHTML={{ __html: mdHtml }}
    ></div>
  );
}

// parse md to html with rehype(debounced)
function useMdHtml({
  value = '',
  lazyValue = '',
  prefixCls = '',
}: {
  value?: string;
  lazyValue?: string;
  prefixCls?: string;
}) {
  const isLongText = value.length > 8000;
  const value1 = useMemo(() => {
    // no need to parseLazy if it's less than 8000
    return isLongText
      ? mdProcess1(value, prefixCls)
      : mdProcess2(value, prefixCls);
  }, [value, prefixCls, isLongText]);
  const [str, setStr] = useState(value1);
  useEffect(() => {
    setStr(value1);
  }, [value1]);
  useEffect(() => {
    if (isLongText) {
      setStr(mdProcess2(lazyValue, prefixCls));
    }
  }, [lazyValue, isLongText, prefixCls]);
  return str;
}
