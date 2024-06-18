import { Button, Stack, Text } from '@mantine/core';
import React from 'react';

export interface TocItem {
  domId: string;
  level: number;
  title: string;
}

const Toc: React.FC<{ data: TocItem[] }> = ({ data }) => {
  const hasContent = data.length > 0;
  return (
    <Stack>
      <Text fw={700}>Table of Contents</Text>
      {hasContent ? (
        <Stack gap={0}>
          {data.map((t) => (
            <Button
              key={t.domId}
              size="sm"
              color="gray"
              variant="subtle"
              fullWidth
              justify="start"
              pl={`${(t.level - 1) * 8 + 8}px`}
              styles={{
                root: {
                  fontWeight: 500,
                },
              }}
              onClick={() => {
                const el = document.getElementById(t.domId);
                if (el) {
                  el.scrollIntoView({ block: 'center', behavior: 'smooth' });
                }
              }}
            >
              {t.title}
            </Button>
          ))}
        </Stack>
      ) : (
        <Text c={'gray'} size="sm">
          No content found.
        </Text>
      )}
    </Stack>
  );
};

export default Toc;
