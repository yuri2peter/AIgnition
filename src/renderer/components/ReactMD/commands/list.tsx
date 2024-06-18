import React from 'react';
import { ICommand, ExecuteState, TextAreaTextApi } from '.';
import {
  selectWord,
  getBreaksNeededForEmptyLineBefore,
  getBreaksNeededForEmptyLineAfter,
  insertBeforeEachLine,
  AlterLineFunction,
} from '../utils/markdownUtils';
import { svgIconProps } from './defines';
import { IconList, IconListCheck, IconListNumbers } from '@tabler/icons-react';

export const makeList = (
  state: ExecuteState,
  api: TextAreaTextApi,
  insertBefore: string | AlterLineFunction
) => {
  const newSelectionRange = selectWord({
    text: state.text,
    selection: state.selection,
    prefix: state.command.prefix!,
  });
  const state1 = api.setSelectionRange(newSelectionRange);

  const breaksBeforeCount = getBreaksNeededForEmptyLineBefore(
    state1.text,
    state1.selection.start
  );
  const breaksBefore = Array(breaksBeforeCount + 1).join('\n');

  const breaksAfterCount = getBreaksNeededForEmptyLineAfter(
    state1.text,
    state1.selection.end
  );
  const breaksAfter = Array(breaksAfterCount + 1).join('\n');

  const { modifiedText, insertionLength } = insertBeforeEachLine(
    state1.selectedText,
    insertBefore
  );
  if (insertionLength < 0) {
    // Remove
    let selectionStart = state1.selection.start;
    let selectionEnd = state1.selection.end;
    if (
      state1.selection.start > 0 &&
      state.text.slice(state1.selection.start - 1, state1.selection.start) ===
        '\n'
    ) {
      selectionStart -= 1;
    }
    if (
      state1.selection.end < state.text.length - 1 &&
      state.text.slice(state1.selection.end, state1.selection.end + 1) === '\n'
    ) {
      selectionEnd += 1;
    }

    api.setSelectionRange({ start: selectionStart, end: selectionEnd });
    api.replaceSelection(`${modifiedText}`);
    api.setSelectionRange({
      start: selectionStart,
      end: selectionStart + modifiedText.length,
    });
  } else {
    // Add
    api.replaceSelection(`${breaksBefore}${modifiedText}${breaksAfter}`);
    const selectionStart = state1.selection.start + breaksBeforeCount;
    const selectionEnd = selectionStart + modifiedText.length;
    api.setSelectionRange({ start: selectionStart, end: selectionEnd });
  }
};

export const unorderedListCommand: ICommand = {
  name: 'unordered-list',
  keyCommand: 'list',
  shortcuts: 'ctrl+shift+u',
  prefix: '- ',
  buttonProps: {
    'aria-label': 'Add unordered list (ctrl + shift + u)',
    title: 'Add unordered list (ctrl + shift + u)',
  },
  icon: <IconList data-name="unordered-list" {...svgIconProps} />,
  execute: (state: ExecuteState, api: TextAreaTextApi) => {
    makeList(state, api, '- ');
  },
};

export const orderedListCommand: ICommand = {
  name: 'ordered-list',
  keyCommand: 'list',
  shortcuts: 'ctrl+shift+o',
  prefix: '1. ',
  buttonProps: {
    'aria-label': 'Add ordered list (ctrl + shift + o)',
    title: 'Add ordered list (ctrl + shift + o)',
  },
  icon: <IconListNumbers data-name="ordered-list" {...svgIconProps} />,
  execute: (state: ExecuteState, api: TextAreaTextApi) => {
    makeList(state, api, (item, index) => `${index + 1}. `);
  },
};

export const checkedListCommand: ICommand = {
  name: 'checked-list',
  keyCommand: 'list',
  shortcuts: 'ctrl+shift+c',
  prefix: '- [ ] ',
  buttonProps: {
    'aria-label': 'Add checked list (ctrl + shift + c)',
    title: 'Add checked list (ctrl + shift + c)',
  },
  icon: <IconListCheck data-name="checked-list" {...svgIconProps} />,
  execute: (state: ExecuteState, api: TextAreaTextApi) => {
    makeList(state, api, (item, index) => `- [ ] `);
  },
};
