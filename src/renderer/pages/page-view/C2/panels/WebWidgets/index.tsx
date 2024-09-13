import { Box, Stack } from '@mantine/core';
import React, { useState } from 'react';
import Widget from './Widget';
import usePluginStorage from 'src/renderer/hooks/usePluginStorage';
import {
  DragDropContext,
  Droppable,
  OnDragEndResponder,
} from '@hello-pangea/dnd';
import { schema, WebWidgetContext } from './defines';
import CreateWidget from './CreateWidget';

const WebWidgets: React.FC<{ show: boolean }> = ({ show }) => {
  const { storage, changeStorage } = usePluginStorage('webWidgets', schema);
  const [dragging, setDragging] = useState(false);
  const ondragstart = () => {
    setDragging(true);
  };
  const onDragEnd: OnDragEndResponder = (result) => {
    setDragging(false);
    // a little function to help us with reordering the result
    const reorder = <T,>(list: T[], startIndex: number, endIndex: number) => {
      const result = Array.from(list);
      const [removed] = result.splice(startIndex, 1);
      result.splice(endIndex, 0, removed!);

      return result;
    };

    // dropped outside the list
    if (!result.destination) {
      return;
    }

    changeStorage((d) => {
      d.gadgets = reorder(
        d.gadgets,
        result.source.index,
        result.destination?.index ?? 0
      );
    });
  };
  return (
    <WebWidgetContext.Provider value={{ changeStorage, dragging, setDragging }}>
      <Stack
        py={gap}
        gap={gap}
        display={show ? undefined : 'none'}
        h={'100%'}
        style={{ overflowY: 'scroll' }}
      >
        <DragDropContext onDragStart={ondragstart} onDragEnd={onDragEnd}>
          <Droppable droppableId="droppable">
            {(provided) => (
              <Stack
                px={gap}
                pr={gap - 4}
                gap={gap}
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                {storage.gadgets.map((t, i) => (
                  <Widget key={t.id} widget={t} index={i} />
                ))}{' '}
                {provided.placeholder}
              </Stack>
            )}
          </Droppable>
        </DragDropContext>
        <Box px={gap} pr={gap - 4}>
          <CreateWidget />
        </Box>
      </Stack>
    </WebWidgetContext.Provider>
  );
};

const gap = 16;

export default WebWidgets;
