import { ActionIcon, Stack, Text, TextInput } from '@mantine/core';
import { IconX } from '@tabler/icons-react';
import React from 'react';
import { useSearchStore } from 'src/renderer/store/useSearchStore';
import KeywordsResultsDisplay from './KeywordsResultsDisplay';
import { useDebouncedCallback } from '@mantine/hooks';

const Search: React.FC<{}> = () => {
  const { inputValue } = useSearchStore();
  const refInput = React.useRef<HTMLInputElement>(null);
  const { setInputValue, reset, searchKeywords } = useSearchStore(
    (s) => s.actions
  );
  const searchKeywordsDebounced = useDebouncedCallback(searchKeywords, 500);
  return (
    <Stack p={16} gap={24} h={'100%'}>
      <Text fw={'bold'}>Search Pages</Text>
      <TextInput
        ref={refInput}
        spellCheck={false}
        value={inputValue}
        onChange={(e) => {
          setInputValue(e.target.value);
          searchKeywordsDebounced();
        }}
        placeholder="Keywords"
        autoFocus
        rightSection={
          <ActionIcon
            variant="subtle"
            color="gray"
            onClick={() => {
              reset();
              refInput.current?.focus();
            }}
          >
            <IconX stroke={1.5} size={14} />
          </ActionIcon>
        }
      />
      <KeywordsResultsDisplay />
    </Stack>
  );
};

export default Search;
