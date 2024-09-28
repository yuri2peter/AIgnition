import React, {
  useEffect,
  useReducer,
  useMemo,
  useRef,
  useImperativeHandle,
  useCallback,
} from 'react';
import MarkdownPreview from '@uiw/react-markdown-preview';
import TextArea from './components/TextArea';
import { ToolbarVisibility } from './components/Toolbar';
import { getCommands, getExtraCommands, ICommand, TextRange } from './commands';
import { reducer, EditorContext, ContextStore } from './Context';
import type { MDEditorProps } from './Types';
import { useDebouncedValue } from '@mantine/hooks';
import MarkdownRender from '../miscs/MarkdownRender';
import { HistoryManager } from './utils/HistoryManager';
import { debounce } from 'lodash';

function setGroupPopFalse(data: Record<string, boolean> = {}) {
  Object.keys(data).forEach((keyname) => {
    data[keyname] = false;
  });
  return data;
}

export type RefMDEditor = ContextStore;

const InternalMDEditor = React.forwardRef<RefMDEditor, MDEditorProps>(
  (props: MDEditorProps, ref: React.ForwardedRef<RefMDEditor>) => {
    const {
      className,
      prefixCls = 'w-md-editor',
      commands = getCommands(),
      commandsFilter,
      direction,
      extraCommands = getExtraCommands(),
      height = 200,
      preview: previewType = 'live',
      fullscreen = false,
      overflow = true,
      previewOptions = {},
      textareaProps,
      autoFocus,
      tabSize = 2,
      defaultTabEnable = false,
      onContentChange,
      instanceId,
      initValue = '',
      hideToolbar,
      toolbarBottom = false,
      refPreview,
      enableScroll,
      previewHeader,
      previewFooter,
      ...other
    } = props || {};

    const propsFixed = {
      className,
      prefixCls,
      commands,
      commandsFilter,
      direction,
      extraCommands,
      height,
      previewType,
      fullscreen,
      overflow,
      previewOptions,
      textareaProps,
      autoFocus,
      tabSize,
      defaultTabEnable,
      onContentChange,
      initValue,
      instanceId,
      hideToolbar,
      toolbarBottom,
      enableScroll,
      refPreview,
      ...other,
    };

    const cmds = commands
      .map((item) => (commandsFilter ? commandsFilter(item, false) : item))
      .filter(Boolean) as ICommand[];
    const extraCmds = extraCommands
      .map((item) => (commandsFilter ? commandsFilter(item, true) : item))
      .filter(Boolean) as ICommand[];
    const [state, dispatch] = useReducer(reducer, {
      markdown: initValue,
      preview: previewType,
      height,
      tabSize,
      defaultTabEnable,
      commands: cmds,
      extraCommands: extraCmds,
      fullscreen,
      barPopup: {},
      markdownLazy: '',
    });
    const refHistoryManager = useRef(
      new HistoryManager<{
        markdown: string;
        selection: TextRange;
      }>()
    );
    const refTouched = useRef(false);
    const container = useRef<HTMLDivElement>(null);
    const refPreviewInner = useRef<HTMLDivElement | null>(null);
    const refProps = useRef(propsFixed);
    const scrollTriggerLog = useRef({ type: '', time: 0 });

    refProps.current = propsFixed;
    const [markdownLazy = ''] = useDebouncedValue(state.markdown, 100);

    useImperativeHandle(ref, () => ({
      ...state,
      container: container.current,
      dispatch,
    }));
    useEffect(() => {
      const stateInit: ContextStore = {};
      if (container.current) {
        stateInit.container = container.current || undefined;
      }
      stateInit.markdown = initValue;
      stateInit.markdownLazy = markdownLazy;
      stateInit.barPopup = {};
      if (dispatch) {
        dispatch({ ...state, ...stateInit });
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const cls = [
      className,
      'wmde-markdown-var',
      direction ? `${prefixCls}-${direction}` : null,
      prefixCls,
      state.preview ? `${prefixCls}-show-${state.preview}` : null,
      state.fullscreen ? `${prefixCls}-fullscreen` : null,
    ]
      .filter(Boolean)
      .join(' ')
      .trim();
    useMemo(
      () =>
        markdownLazy !== state.markdownLazy &&
        dispatch({ markdownLazy: markdownLazy }),
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [markdownLazy]
    );
    useMemo(
      () => previewType !== state.preview && dispatch({ preview: previewType }),
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [previewType]
    );
    useMemo(
      () => tabSize !== state.tabSize && dispatch({ tabSize }),
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [tabSize]
    );
    useMemo(
      () => autoFocus !== state.autoFocus && dispatch({ autoFocus: autoFocus }),
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [autoFocus]
    );
    useMemo(
      () =>
        fullscreen !== state.fullscreen && dispatch({ fullscreen: fullscreen }),
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [fullscreen]
    );
    useMemo(
      () => height !== state.height && dispatch({ height: height }),
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [height]
    );
    useMemo(
      () => commands !== state.commands && dispatch({ commands: cmds }),
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [props.commands]
    );
    useMemo(
      () =>
        extraCommands !== state.extraCommands &&
        dispatch({ extraCommands: extraCmds }),
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [props.extraCommands]
    );

    const textareaDomRef = useRef<HTMLDivElement>();
    const active = useRef<'text' | 'preview'>('preview');

    useMemo(() => {
      textareaDomRef.current = state.textareaWarp;
      if (state.textareaWarp) {
        state.textareaWarp.addEventListener('mouseover', () => {
          active.current = 'text';
        });
        state.textareaWarp.addEventListener('mouseleave', () => {
          active.current = 'preview';
        });
      }
    }, [state.textareaWarp]);

    useEffect(() => {
      refTouched.current = false;
      dispatch({ markdown: refProps.current.initValue });
      refHistoryManager.current.reset();
      refHistoryManager.current.push({
        markdown: refProps.current.initValue,
        selection: { start: 0, end: 0 },
      });
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [instanceId]);

    useEffect(() => {
      if (!refTouched.current && markdownLazy === refProps.current.initValue) {
        // if nothing changed
      } else {
        refTouched.current = true;
        refProps.current.onContentChange?.(markdownLazy);
      }
    }, [markdownLazy]);

    const handleScroll = (
      e: React.UIEvent<HTMLDivElement>,
      type: 'text' | 'preview'
    ) => {
      if (!refProps.current.enableScroll) return;
      if (
        scrollTriggerLog.current.type !== type &&
        Date.now() - scrollTriggerLog.current.time < 100
      )
        return;
      scrollTriggerLog.current = {
        type,
        time: Date.now(),
      };
      const textareaDom = textareaDomRef.current;
      const previewDom = refPreviewInner.current;

      if (textareaDom && previewDom) {
        const scale =
          (textareaDom.scrollHeight - textareaDom.offsetHeight) /
          (previewDom.scrollHeight - previewDom.offsetHeight);
        if (e.target === textareaDom && type === 'text') {
          previewDom.scrollTop = textareaDom.scrollTop / scale;
        }
        if (e.target === previewDom && type === 'preview') {
          textareaDom.scrollTop = previewDom.scrollTop * scale;
        }
      }
    };

    const handlePreviewScroll = (e: React.UIEvent<HTMLDivElement, UIEvent>) =>
      handleScroll(e, 'preview');
    const markdownRender = useMemo(
      () => (
        <MarkdownRender
          {...previewOptions}
          text={markdownLazy}
          defaultShowPreviewInHtmlCodeBlock
        />
      ),
      [previewOptions, markdownLazy]
    );
    const mdPreview = (
      <div
        ref={(dom) => {
          refPreview?.(dom);
          refPreviewInner.current = dom;
        }}
        className={`${prefixCls}-preview`}
        onScroll={handlePreviewScroll}
      >
        <div className={`${prefixCls}-preview-body`}>
          {previewHeader}
          {markdownRender}
          {previewFooter}
        </div>
      </div>
    );

    const containerStyle = { ...other.style, height: state.height || '100%' };
    const containerClick = () =>
      dispatch({ barPopup: { ...setGroupPopFalse(state.barPopup) } });
    const changeHandleDebounced = useMemo(() => {
      return debounce((evn: React.ChangeEvent<HTMLTextAreaElement>) => {
        refHistoryManager.current.push({
          markdown: evn.target.value,
          selection: {
            start: evn.target.selectionStart,
            end: evn.target.selectionEnd,
          },
        });
      }, 1000);
    }, []);
    const changeHandle = useCallback(
      (evn: React.ChangeEvent<HTMLTextAreaElement>) => {
        dispatch({ markdown: evn.target.value });
        changeHandleDebounced(evn);
      },
      [changeHandleDebounced]
    );
    const ctx: ContextStore = {
      ...state,
      historyManager: refHistoryManager.current,
      dispatch,
    };
    return (
      <EditorContext.Provider value={ctx}>
        <div
          ref={container}
          className={cls}
          {...other}
          onClick={containerClick}
          style={containerStyle}
        >
          <ToolbarVisibility
            hideToolbar={hideToolbar}
            toolbarBottom={toolbarBottom}
            prefixCls={prefixCls}
            overflow={overflow}
            placement="top"
          />
          <div className={`${prefixCls}-content`}>
            {/(edit|live)/.test(state.preview || '') && (
              <TextArea
                className={`${prefixCls}-input`}
                prefixCls={prefixCls}
                autoFocus={autoFocus}
                {...textareaProps}
                onChange={changeHandle}
                onScroll={(e) => handleScroll(e, 'text')}
              />
            )}
            {/* {/(live|preview)/.test(state.preview || '') && mdPreview} */}
            {mdPreview}
          </div>
          <ToolbarVisibility
            hideToolbar={hideToolbar}
            toolbarBottom={toolbarBottom}
            prefixCls={prefixCls}
            overflow={overflow}
            placement="bottom"
          />
        </div>
      </EditorContext.Provider>
    );
  }
);

type EditorComponent = typeof InternalMDEditor & {
  Markdown: typeof MarkdownPreview;
};

const Editor = InternalMDEditor as EditorComponent;
Editor.Markdown = MarkdownPreview;

export default Editor;
