import {
  ActionIcon,
  Box,
  Card,
  Divider,
  Group,
  Stack,
  Text,
  Tooltip,
} from '@mantine/core';
import React, { memo, useContext } from 'react';
import ResizeDraggable from 'react-draggable';
import styles from './styles.module.css';
import { WebWidgetContext, WebWidgets } from './defines';
import FlexGrow from 'src/renderer/components/miscs/FlexGrow';
import { modals } from '@mantine/modals';
import Form from './Form';
import { IconGripVertical, IconEdit, IconX } from '@tabler/icons-react';
import { Draggable as ReorderDraggable } from '@hello-pangea/dnd';

const Widget: React.FC<{ widget: WebWidgets; index: number }> = ({
  widget,
  index,
}) => {
  const { id, content, name, height } = widget;
  const { changeStorage, dragging, setDragging } = useContext(WebWidgetContext);
  const handleEdit = () => {
    modals.open({
      title: 'Edit Widget',
      children: (
        <>
          <Form
            initialValues={{ ...widget }}
            onSubmit={(values) => {
              modals.closeAll();
              changeStorage((d) => {
                const item = d.gadgets.find((t) => t.id === id);
                if (item) {
                  Object.assign(item, values);
                }
              });
            }}
            onCancel={() => modals.closeAll()}
          />
        </>
      ),
    });
  };
  const handleDelete = () => {
    modals.openConfirmModal({
      title: 'Please confirm your action',
      children: (
        <Text size="sm">
          This action will remove the widget. Please click one of these buttons
          to proceed.
        </Text>
      ),
      labels: { confirm: 'Confirm', cancel: 'Cancel' },
      onConfirm: () => {
        changeStorage((d) => {
          d.gadgets = d.gadgets.filter((t) => t.id !== id);
        });
      },
    });
  };
  const iframeBlock = (
    <Box className={styles.iframeBlock} h={height}>
      <Box
        className={styles.cover}
        display={dragging ? undefined : 'none'}
      ></Box>
      <iframe
        className={styles.iframe}
        referrerPolicy="no-referrer"
        {...(checkUrl(content) ? { src: content } : { srcDoc: content })}
      />
      <ResizeDraggable
        axis="y"
        position={{ x: 0, y: 0 }}
        onStart={() => {
          setDragging(true);
        }}
        onDrag={(e, data) => {
          const dy = data.deltaY;
          changeStorage((d) => {
            const item = d.gadgets.find((t) => t.id === id);
            if (item) {
              item.height += dy;
            }
          });
        }}
        onStop={() => {
          setDragging(false);
          changeStorage((d) => {
            const item = d.gadgets.find((t) => t.id === id);
            if (item) {
              item.height = Math.floor(item.height);
            }
          });
        }}
      >
        <Box className={styles.dragResize}></Box>
      </ResizeDraggable>
    </Box>
  );
  return (
    <ReorderDraggable key={id} draggableId={id} index={index}>
      {(provided, snapshot) => (
        <Card
          h={'fit-content'}
          p={0}
          className={styles.widget}
          ref={provided.innerRef}
          {...provided.draggableProps}
          style={getItemStyle(
            snapshot.isDragging,
            provided.draggableProps.style
          )}
          withBorder
        >
          <Stack gap={0}>
            <Group gap={4} p={4}>
              <ActionIcon
                size={'sm'}
                variant="subtle"
                c={'gray'}
                {...provided.dragHandleProps}
              >
                <IconGripVertical size={16} />
              </ActionIcon>
              <Text>{name}</Text>
              <FlexGrow />
              <Tooltip label="Edit">
                <ActionIcon
                  size={'sm'}
                  variant="subtle"
                  c={'gray'}
                  onClick={handleEdit}
                >
                  <IconEdit size={16} />
                </ActionIcon>
              </Tooltip>
              <Tooltip label="Close">
                <ActionIcon
                  size={'sm'}
                  variant="subtle"
                  c={'gray'}
                  onClick={handleDelete}
                >
                  <IconX size={16} />
                </ActionIcon>
              </Tooltip>
            </Group>
            <Divider />
            {iframeBlock}
          </Stack>
        </Card>
      )}
    </ReorderDraggable>
  );
};

export default memo(Widget);

function checkUrl(str: string) {
  try {
    new URL(str);
    return true;
  } catch (e) {
    return false;
  }
}

const getItemStyle = (isDragging: boolean, draggableStyle: any) => ({
  // some basic styles to make the items look a bit nicer
  userSelect: 'none',

  // change background colour if dragging
  background: isDragging ? 'lightgreen' : undefined,

  // styles we need to apply on draggables
  ...draggableStyle,
});
