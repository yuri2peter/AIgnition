import React, { useCallback, useRef } from 'react';
import MDEditor, { ContextStore } from '../ReactMD';
import { useDebouncedCallback } from '@mantine/hooks';
import './preview.css';

type OnChange = (
  value?: string | undefined,
  event?: React.ChangeEvent<HTMLTextAreaElement> | undefined,
  state?: ContextStore | undefined
) => void;

const Markzen: React.FC<
  React.ComponentProps<typeof MDEditor> & {
    onDebouncedChange?: React.ComponentProps<typeof MDEditor>['onChange'];
  }
> = ({
  onChange = () => {},
  onDebouncedChange = () => {},
  ...MDEditorProps
}) => {
  // store the refProps in useRef
  const refProps = useRef({
    onChange,
    onDebouncedChange,
  });
  Object.assign(refProps.current, {
    onChange,
    onDebouncedChange,
  });

  // handle change
  const handleDebouncedChange = useDebouncedCallback<OnChange>((...args) => {
    refProps.current.onDebouncedChange(...args);
  }, 1000);
  const handleChange = useCallback<OnChange>(
    (...args) => {
      refProps.current.onChange(...args);
      handleDebouncedChange(...args);
    },
    [handleDebouncedChange]
  );

  return (
    <MDEditor
      {...MDEditorProps}
      onChange={handleChange}
      data-color-mode="light"
      // toolbarBottom
      previewOptions={{
        className: 'no-prose',
        components: {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          a: ({ node, ...props }) => (
            <a {...props} target="_blank" rel="noreferrer" />
          ),
        },
      }}
    />
  );
};

export default Markzen;
