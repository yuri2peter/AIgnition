import { Button } from '@mantine/core';
import { IconPlus } from '@tabler/icons-react';
import React, { useContext } from 'react';
import { modals } from '@mantine/modals';
import Form from './Form';
import { shortId } from 'src/common/utils/string';
import { WebWidgetContext, WebWidgetsSchema } from './defines';

const CreateWidget: React.FC<{}> = () => {
  const { changeStorage } = useContext(WebWidgetContext);
  const handleClick = () => {
    modals.open({
      title: 'Create Widget',
      children: (
        <>
          <Form
            initialValues={WebWidgetsSchema.parse({
              id: shortId(),
            })}
            onSubmit={(values) => {
              modals.closeAll();
              changeStorage((d) => {
                d.gadgets.push(values);
              });
            }}
            onCancel={() => modals.closeAll()}
          />
        </>
      ),
    });
  };
  return (
    <Button
      fullWidth
      variant="light"
      leftSection={<IconPlus size={16} />}
      onClick={handleClick}
      style={{ flexShrink: 0 }}
    >
      Create Widget
    </Button>
  );
};

export default CreateWidget;
