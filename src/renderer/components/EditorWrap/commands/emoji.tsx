import React, { useEffect, useState } from 'react';
import { IconMoodPlus } from '@tabler/icons-react';
import { ICommand } from 'src/renderer/components/ReactMD';
import { MEmojiSelector } from 'react-emoji-selectors';
import { svgIconProps } from 'src/renderer/components/ReactMD/commands/defines';

export const emojiSelector: ICommand = {
  name: 'Emoji',
  keyCommand: 'Emoji',
  title: 'Emoji selector',
  icon: <IconMoodPlus {...svgIconProps} />,
  execute: async (state, api) => {
    openEmojiSelector((emoji) => {
      api.replaceSelection(emoji);
    });
  },
};

const EmojiSelectorProviderContext = {
  handleOpen: () => {},
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  handleSelect: (emoji: string) => {},
};
export const EmojiSelectorProvider: React.FC<{}> = () => {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    EmojiSelectorProviderContext.handleOpen = () => setOpen(true);
    return () => {
      EmojiSelectorProviderContext.handleOpen = () => {};
    };
  }, []);
  return (
    open && (
      <MEmojiSelector
        onClose={() => {
          setOpen(false);
        }}
        output={EmojiSelectorProviderContext.handleSelect}
      />
    )
  );
};
export function openEmojiSelector(onSelect: (emoji: string) => void) {
  EmojiSelectorProviderContext.handleSelect = onSelect;
  EmojiSelectorProviderContext.handleOpen();
  setTimeout(() => {
    (
      document.querySelector(
        '.emoji-mobile-picker input'
      ) as null | HTMLInputElement
    )?.focus();
  }, 500);
}
