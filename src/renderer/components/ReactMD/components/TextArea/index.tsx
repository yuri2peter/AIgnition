import React, { useEffect, Fragment, useContext } from 'react';
import { EditorContext, ContextStore } from '../../Context';
import Markdown from './Markdown';
import Textarea from './Textarea';
import { IProps } from '../../Types';
import { TextAreaCommandOrchestrator } from '../../commands';
import './index.css';
import SelectionDisplay from './SelectionDisplay';

export interface ITextAreaProps
  extends Omit<
      React.TextareaHTMLAttributes<HTMLTextAreaElement>,
      'value' | 'onScroll'
    >,
    IProps {
  value?: string;
  onScroll?: (e: React.UIEvent<HTMLDivElement>) => void;
}

export type TextAreaRef = {
  text?: HTMLTextAreaElement;
  warp?: HTMLDivElement;
};

export default function TextArea(props: ITextAreaProps) {
  const { prefixCls, className, onScroll, ...otherProps } = props || {};
  const { dispatch, textarea, textSelection } = useContext(EditorContext);
  const textRef = React.useRef<HTMLTextAreaElement>(null);
  const executeRef = React.useRef<TextAreaCommandOrchestrator>();
  const warp = React.createRef<HTMLDivElement>();
  useEffect(() => {
    const state: ContextStore = {};
    if (warp.current) {
      state.textareaWarp = warp.current || undefined;
    }
    if (dispatch) {
      dispatch({ ...state });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (textRef.current && dispatch) {
      const commandOrchestrator = new TextAreaCommandOrchestrator(
        textRef.current
      );
      executeRef.current = commandOrchestrator;
      dispatch({ textarea: textRef.current, commandOrchestrator });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      ref={warp}
      className={`${prefixCls}-area ${className || ''}`}
      onScroll={onScroll}
      onClick={() => {
        if (textarea) {
          const focused = textarea === document.activeElement;
          if (!focused) {
            textarea.focus();
            textarea.setSelectionRange(
              textSelection?.start ?? 0,
              textSelection?.end ?? 0
            );
          }
        }
      }}
    >
      <div className={`${prefixCls}-text`} style={{ minHeight: '100%' }}>
        <Fragment>
          <Markdown prefixCls={prefixCls} />
          <SelectionDisplay prefixCls={prefixCls} />
          <Textarea prefixCls={prefixCls} {...otherProps} />
        </Fragment>
      </div>
    </div>
  );
}
