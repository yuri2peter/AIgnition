import React, { useMemo, useRef } from 'react';
import MDEditor, { ContextStore } from '../ReactMD';
import { MarkdownPreviewProps } from '@uiw/react-markdown-preview';
import { html2markdown, insertFilesIntoEditor } from './utils';
import { useCommands, useExtraCommands } from './commands';
import { useScreenSizeStore } from 'src/renderer/store/useScreenSizeStore';
import { EmojiSelectorProvider } from './commands/emoji';
import { tryPasteCopyline } from '../ReactMD/utils/copyline';
import useIsLargeScreen from 'src/renderer/hooks/screenSize/useIsLargeScreen';

const EditorWrap: React.FC<
  React.ComponentProps<typeof MDEditor> & {
    useAi?: boolean;
  }
> = ({ useAi = false, ...MDEditorProps }) => {
  const refEditor = useRef<ContextStore>(null);
  const screenSizeLevel = useScreenSizeStore((s) => s.screenSizeLevel);
  const isLargeScreen = useIsLargeScreen();
  const commands = useCommands({ useAi, screenSizeLevel });
  const extraCommands = useExtraCommands({ screenSizeLevel });
  const previewOptions: Omit<MarkdownPreviewProps, 'source'> = useMemo(() => {
    return {
      className: 'mx-auto py-8',
    };
  }, []);

  const previewType = isLargeScreen ? 'live' : 'preview';

  return (
    <>
      <EmojiSelectorProvider />
      <MDEditor
        {...MDEditorProps}
        ref={refEditor}
        defaultTabEnable={false}
        preview={previewType}
        enableScroll
        textareaProps={{
          placeholder: 'Start typing...',
        }}
        className="prism-highlight prism-highlight-light"
        commands={commands}
        extraCommands={extraCommands}
        onPaste={(e) => {
          const textApi = refEditor.current?.commandOrchestrator?.textApi;
          if (!textApi) {
            return;
          }
          if (tryPasteCopyline(e, textApi)) {
            return;
          }
          // paste html content
          const html = e.clipboardData.getData('text/html');
          if (html) {
            e.preventDefault();
            textApi.replaceSelection(html2markdown(html));
            return;
          }
          // paste files
          const files = Array.from(e.clipboardData.files);
          if (files.length > 0) {
            e.preventDefault();
            insertFilesIntoEditor(
              files,
              refEditor.current!.commandOrchestrator!.textApi
            );
            return;
          }
        }}
        onDrop={(e) => {
          const files = Array.from(e.dataTransfer.files);
          if (files.length > 0) {
            e.preventDefault();
            insertFilesIntoEditor(
              files,
              refEditor.current!.commandOrchestrator!.textApi
            );
            return;
          }
        }}
        previewOptions={previewOptions}
      />
    </>
  );
};

export default EditorWrap;
