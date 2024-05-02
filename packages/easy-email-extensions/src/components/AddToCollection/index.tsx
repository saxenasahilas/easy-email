import { Modal } from '@arco-design/web-react';
import { Stack, useBlock, useEditorProps } from 'easy-email-editor';
import React from 'react';
import { Form } from 'react-final-form';
import { v4 as uuidv4 } from 'uuid';
import { ImageUploaderField, TextAreaField, TextField } from '../Form';

export const AddToCollection: React.FC<{
  visible: boolean;
  setVisible: (v: boolean) => void;
}> = ({ visible, setVisible }) => {
  const { focusBlock: focusBlockData } = useBlock();
  const { onAddCollection, onUploadImage } = useEditorProps();

  const onSubmit = (values: {
    label: string;
    helpText: string;
    thumbnail: string;
  }) => {
    if (!values.label) return;
    const uuid = uuidv4();
    // @ts-ignore
    onAddCollection?.({
      label: values.label,
      helpText: values.helpText,
      data: focusBlockData!,
      thumbnail: values.thumbnail,
      id: uuid,
    });
    setVisible(false);
  };

  return (
    <Form
      initialValues={{ label: '', helpText: '', thumbnail: '' }}
      onSubmit={onSubmit}
    >
      {({ handleSubmit }) => (
        <Modal
          maskClosable={false}
          style={{ zIndex: 2000 }}
          visible={visible}
          title={String('Add to collection')}
          onOk={() => handleSubmit()}
          onCancel={() => setVisible(false)}
        >
          {/* @ts-ignore */}
          <Stack vertical>
            {/* @ts-ignore */}
            <Stack.Item />
            <TextField
              label={String('Title')}
              name='label'
              validate={(val: string) => {
                if (!val) return String('Title required!');
                return undefined;
              }}
            />
            <TextAreaField label={String('Description')} name='helpText' />
            <ImageUploaderField
              label={String('Thumbnail')}
              name={'thumbnail'}
              uploadHandler={onUploadImage}
              validate={(val: string) => {
                if (!val) return String('Thumbnail required!');
                return undefined;
              }}
            />
          </Stack>
        </Modal>
      )}
    </Form>
  );
};
