import React, { useContext, useEffect, useMemo } from 'react';
import { EditorContext } from '../../Context';
import { html2Escape } from '../../utils/textProcess';

const SelectionDisplay: React.FC<{ prefixCls?: string }> = ({ prefixCls }) => {
  const {
    textarea,
    markdown = '',
    dispatch,
    textSelection = { start: 0, end: 0 },
  } = useContext(EditorContext);
  useEffect(() => {
    const handleSelect = () => {
      const input = textarea!;
      // use setTimeout to wait for the textarea to be updated
      setTimeout(() => {
        dispatch?.({
          textSelection: {
            start: input.selectionStart,
            end: input.selectionEnd,
          },
        });
      });
    };
    const events = ['select', 'keyup', 'mouseup'];
    if (textarea) {
      events.forEach((event) => {
        textarea.addEventListener(event, handleSelect);
      });
    }
    return () => {
      if (textarea) {
        events.forEach((event) => {
          textarea.removeEventListener(event, handleSelect);
        });
      }
    };
  }, [dispatch, textarea]);
  const textState = useMemo(() => {
    return {
      prefix: html2Escape(markdown.slice(0, textSelection.start)),
      suffix: html2Escape(markdown.slice(textSelection.end)),
      selected: html2Escape(
        markdown.slice(textSelection.start, textSelection.end)
      ),
    };
  }, [textSelection, markdown]);
  const html = `<pre class="${prefixCls}-text-pre"><code><span>${textState.prefix}</span><span class="selected">${textState.selected}</span><span>${textState.suffix}</span></code></pre>`;
  return (
    <div
      className={`${prefixCls}-text-selection`}
      dangerouslySetInnerHTML={{ __html: html }}
    ></div>
  );
};

export default SelectionDisplay;
