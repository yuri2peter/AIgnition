import { Button, Divider, Stack, Textarea } from '@mantine/core';
import { IconMessage2 } from '@tabler/icons-react';
import React, { useCallback, useRef, useState } from 'react';
import { zodSafeString } from 'src/common/utils/type';
import MarkdownRender from 'src/renderer/components/miscs/MarkdownRender';
import { fetchEventSource } from 'src/renderer/helpers/fetchEventSource';
import { useNonSensitiveSettingsStore } from 'src/renderer/store/useNonSensitiveSettingsStore';
import { z } from 'zod';

const Chat: React.FC<{}> = () => {
  const refSignal = useRef<AbortController>(new AbortController());
  const enabledAi = useNonSensitiveSettingsStore((s) => s.settings.ai.enabled);
  const [answering, setAnswering] = useState(false);
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const handleAsk = useCallback(() => {
    setAnswer('');
    setAnswering(true);
    query({
      prompt: question,
      signal: refSignal.current.signal,
      onUpdate: setAnswer,
    });
  }, [question]);
  if (!enabledAi) return null;
  const QuestionSection = (
    <>
      <Textarea
        label="Question"
        minRows={3}
        maxRows={8}
        autosize
        placeholder="Enter a question"
        spellCheck={false}
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.stopPropagation();
            e.preventDefault();
            handleAsk();
          }
        }}
      />
      <Button
        variant="light"
        leftSection={<IconMessage2 size={16} />}
        disabled={!question}
        onClick={handleAsk}
      >
        Ask AI
      </Button>
    </>
  );
  const AnswerSection = (
    <>
      <MarkdownRender text={answer || '**AI is thinking...**'} />
      <Button
        variant="light"
        leftSection={<IconMessage2 size={16} />}
        onClick={() => {
          setAnswering(false);
          setAnswer('');
          refSignal.current.abort();
        }}
      >
        Go back to question
      </Button>
    </>
  );
  return <Stack>{answering ? AnswerSection : QuestionSection}</Stack>;
};

export default Chat;

async function query({
  prompt,
  signal,
  onUpdate,
}: {
  prompt: string;
  signal?: AbortSignal;
  onUpdate?: (text: string) => void;
}) {
  await fetchEventSource('/api/ai/chat', {
    signal,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      prompt,
      stream: true,
    }),
    onmessage: (ev) => {
      const text = z
        .object({ data: zodSafeString() })
        .parse(JSON.parse(ev.data)).data;
      onUpdate?.(text);
    },
    onerror: console.error,
  });
}
