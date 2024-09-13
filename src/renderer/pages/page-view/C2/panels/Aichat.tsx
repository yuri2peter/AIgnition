import {
  ActionIcon,
  Box,
  Button,
  Card,
  Checkbox,
  CopyButton,
  Group,
  Stack,
  Textarea,
  Tooltip,
} from '@mantine/core';
import {
  IconCheck,
  IconCopy,
  IconPlayerStopFilled,
  IconPlus,
  IconReload,
  IconSend,
  IconX,
} from '@tabler/icons-react';
import React, { useCallback, useEffect, useRef } from 'react';
import FlexGrow from 'src/renderer/components/miscs/FlexGrow';
import MarkdownRender from 'src/renderer/components/miscs/MarkdownRender';
import { useEventListener } from 'src/renderer/hooks/useEvent';
import { useAichatStore } from 'src/renderer/store/useAichatStore';
import {
  selectCurrentPage,
  usePageStore,
} from 'src/renderer/store/usePageStore';

const Aichat: React.FC = () => {
  const history = useAichatStore((s) => s.history);
  const refList = useRef<HTMLDivElement>(null);
  const scrollToBottom = useCallback(() => {
    requestAnimationFrame(() => {
      refList.current?.scrollTo({
        top: refList.current.scrollHeight,
        behavior: 'smooth',
      });
    });
  }, []);
  useEffect(() => {
    scrollToBottom();
  }, [scrollToBottom]);
  useEventListener('EVENT__PANEL_AICHAT_SCROLL_TO_BOTTOM', () => {
    scrollToBottom();
  });
  return (
    <Stack
      ref={refList}
      h={'100%'}
      align="stretch"
      gap={16}
      // display={show ? undefined : 'none'}
      style={{ overflow: 'auto', flexGrow: 1 }}
      px={16}
      pt={16}
    >
      {history.length > 0 ? <HistoryDisplay /> : <Hint />}
      <FlexGrow />
      <ActionArea />
    </Stack>
  );
};

export default Aichat;

const Hint = () => {
  const text = `
#### Hi, I am an AI chatbot designed to help you with various tasks.
To get started, you can use the following prompts:

- **"Summarize this text..."** - To get a concise summary of a piece of text.
- **"Translate this into [language]..."** - To translate text into another language.
- **"Write a [type of text] about [topic]..."** - To generate different types of content like poems, code, scripts, musical pieces, email, letters, etc.
- **"Answer this question..."** - To get answers to your questions.

Feel free to experiment with different prompts and ask me anything!
`;
  return <MarkdownRender theme="tiny" text={text} />;
};

const ActionArea = () => {
  const currentPage = usePageStore(selectCurrentPage);
  const refInput = useRef<HTMLTextAreaElement>(null);
  const handleFocusInput = useCallback(() => {
    setTimeout(() => {
      refInput.current?.focus();
    }, 20);
  }, []);
  const {
    prompt,
    history,
    processing,
    usePageContent,
    actions: { setPrompt, send, abort, clearHistory, setUsePageContent },
  } = useAichatStore();
  const hasHistory = history.length > 0;
  useEffect(() => {
    setUsePageContent(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage?.id]);
  const button = (() => {
    if (processing) {
      return (
        <Button
          color="red"
          variant="light"
          leftSection={<IconPlayerStopFilled size={16} stroke={1.5} />}
          onClick={abort}
        >
          Abort
        </Button>
      );
    }
    if (hasHistory && !prompt) {
      return (
        <Button
          color="orange"
          variant="light"
          leftSection={<IconPlus size={16} stroke={1.5} />}
          onClick={clearHistory}
        >
          New chat
        </Button>
      );
    }
    return (
      <Button
        disabled={!prompt}
        variant="light"
        leftSection={<IconSend size={16} stroke={1.5} />}
        onClick={() => {
          send();
          handleFocusInput();
        }}
      >
        Send
      </Button>
    );
  })();
  return (
    <Stack
      align="stretch"
      p={16}
      style={{
        position: 'sticky',
        bottom: 0,
        left: 0,
        backgroundColor: 'var(--mantine-color-gray-0)',
      }}
    >
      {currentPage && (
        <Checkbox
          label="Send current page to AI as context"
          checked={usePageContent}
          onChange={(e) => setUsePageContent(e.currentTarget.checked)}
        />
      )}
      <Textarea
        ref={refInput}
        autoFocus
        data-autofocus
        minRows={3}
        maxRows={5}
        autosize
        placeholder="Enter message"
        spellCheck={false}
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.stopPropagation();
            e.preventDefault();
            if (!processing && prompt) {
              send();
              handleFocusInput();
            }
          }
        }}
      />
      {button}
    </Stack>
  );
};

const HistoryDisplay = () => {
  const { history } = useAichatStore();
  const { removeHistoryFromIndex, regenerateFromIndex } = useAichatStore(
    (s) => s.actions
  );
  return history.map((h, i) => (
    <React.Fragment key={i}>
      <MessageBox
        bg="var(--mantine-color-gray-1)"
        content={h.user}
        onRemove={() => removeHistoryFromIndex(i)}
        onRegenerate={() => regenerateFromIndex(i)}
      />
      <MessageBox
        bg="white"
        content={h.model || 'AI is thinking...'}
        onRemove={() => removeHistoryFromIndex(i)}
        onRegenerate={() => regenerateFromIndex(i)}
      />
    </React.Fragment>
  ));
};

const MessageBox = ({
  bg,
  content,
  onRegenerate,
  onRemove,
}: {
  bg?: string;
  content: string;
  onRegenerate?: () => void;
  onRemove?: () => void;
}) => {
  return (
    <Stack style={{ flexShrink: 0 }} gap={6}>
      <Card withBorder style={{ flexShrink: 0, background: bg }} p={0}>
        <Box p={8}>
          <MarkdownRender theme="tiny" text={content} />
        </Box>
        <Group gap={4} className="hover-show">
          <FlexGrow />
          <CopyButton value={content} timeout={2000}>
            {({ copied, copy }) => (
              <Tooltip
                label={copied ? 'Copied' : 'Copy'}
                withArrow
                position="right"
              >
                <ActionIcon
                  size={'sm'}
                  variant="subtle"
                  color={copied ? 'teal' : 'gray'}
                  onClick={copy}
                >
                  {copied ? <IconCheck size={16} /> : <IconCopy size={16} />}
                </ActionIcon>
              </Tooltip>
            )}
          </CopyButton>
          <Tooltip label="Regenerate">
            <ActionIcon size={'sm'} variant="subtle" c={'gray'}>
              <IconReload size={16} onClick={onRegenerate} />
            </ActionIcon>
          </Tooltip>
          <Tooltip label="Remove">
            <ActionIcon size={'sm'} variant="subtle" c={'gray'}>
              <IconX size={16} onClick={onRemove} />
            </ActionIcon>
          </Tooltip>
        </Group>
      </Card>
    </Stack>
  );
};
