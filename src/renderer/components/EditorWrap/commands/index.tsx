import {
  bold,
  code,
  divider,
  help,
  link,
  quote,
  redo,
  strikethrough,
  undo,
  titleGroup,
  ICommand,
  codeEdit,
  codePreview,
  codeLive,
  fullscreen,
} from 'src/renderer/components/ReactMD/commands';
import { formatGroup1 } from './formatGroup1';
import { formatGroup2 } from './formatGroup2';
import { continueWriting } from './ai/autocomplete';
import { enhancementGroup } from './ai/enhancementGroup';
import { ScreenSizeLevel } from 'src/common/type/screenSize';
import { useMemo } from 'react';
import { emojiSelector } from './emoji';

export const useCommands = ({
  useAi,
  screenSizeLevel,
}: {
  useAi?: boolean;
  screenSizeLevel: ScreenSizeLevel;
}) => {
  return useMemo<ICommand[]>(() => {
    // Small
    if (screenSizeLevel <= ScreenSizeLevel.Small) {
      if (useAi) {
        return [
          undo,
          redo,
          titleGroup,
          formatGroup2,
          divider,
          continueWriting,
          enhancementGroup,
        ];
      } else {
        return [undo, redo, titleGroup, formatGroup2];
      }
    }

    // Not Small
    if (useAi) {
      return [
        undo,
        redo,
        divider,
        titleGroup,
        bold,
        strikethrough,
        link,
        quote,
        code,
        emojiSelector,
        formatGroup1,
        divider,
        continueWriting,
        enhancementGroup,
        divider,
        help,
      ];
    } else {
      return [
        undo,
        redo,
        divider,
        titleGroup,
        bold,
        strikethrough,
        link,
        quote,
        code,
        emojiSelector,
        formatGroup1,
        divider,
        help,
      ];
    }
  }, [useAi, screenSizeLevel]);
};

export const useExtraCommands = ({
  screenSizeLevel,
}: {
  screenSizeLevel: ScreenSizeLevel;
}) => {
  return useMemo<ICommand[]>(() => {
    // Small
    if (screenSizeLevel <= ScreenSizeLevel.Small) {
      return [codeEdit, codePreview];
    }

    // Medium
    return [codeEdit, codeLive, codePreview, divider, fullscreen];
  }, [screenSizeLevel]);
};
