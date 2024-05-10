import React from 'react';
import {
  ColorPickerField,
  EditTabField,
  ImageUploaderField,
  InputWithUnitField,
  RadioGroupField,
  SelectField,
  TextField,
} from '@extensions/components/Form';
import { IconLink } from '@arco-design/web-react/icon';
import { Collapse, Grid, Space } from '@arco-design/web-react';
import { Stack, useEditorProps, useFocusIdx } from 'easy-email-editor';
import { AttributesPanelWrapper } from '@extensions/AttributePanel/components/attributes/AttributesPanelWrapper';
import { Align } from '@extensions/AttributePanel/components/attributes/Align';
import { ICarousel } from 'easy-email-core';
import { ClassName } from '../../attributes/ClassName';
import { CollapseWrapper } from '../../attributes/CollapseWrapper';

const options = [
  {
    value: 'hidden',
    get label() {
      return String('hidden');
    },
  },
  {
    value: 'visible',
    get label() {
      return String('visible');
    },
  },
];

export function Carousel() {
  const { focusIdx } = useFocusIdx();
  return (
    <AttributesPanelWrapper style={{ padding: 0 }}>
      <CollapseWrapper defaultActiveKey={['0', '1', '2', '3', '4']}>
        <Collapse.Item
          name='0'
          header={String('Dimension')}
        >
          <Space direction='vertical'>
            <InputWithUnitField
              label={String('Thumbnail width')}
              name={`${focusIdx}.attributes.tb-width`}
              quickchange
              inline
            />

            <RadioGroupField
              label={String('Thumbnails')}
              name={`${focusIdx}.attributes.thumbnails`}
              options={options}
              inline
            />
            <Align inline />
          </Space>
        </Collapse.Item>
        <Collapse.Item
          name='4'
          contentStyle={{ padding: 0 }}
          header={String('Images')}
        >
          {/* @ts-ignore */}
          <Stack
            vertical
            spacing='tight'
          >
            <EditTabField
              tabPosition='top'
              name={`${focusIdx}.data.value.images`}
              label=''
              labelHidden
              renderItem={(item, index) => (
                <CarouselImage
                  item={item}
                  index={index}
                />
              )}
              additionItem={{
                src: 'https://www.mailjet.com/wp-content/uploads/2016/11/ecommerce-guide.jpg',
                target: '_blank',
              }}
            />
          </Stack>
        </Collapse.Item>
        <Collapse.Item
          name='3'
          header={String('Icon')}
        >
          <Grid.Row>
            <Grid.Col span={11}>
              <TextField
                label={String('Left icon')}
                name={`${focusIdx}.attributes.left-icon`}
              />
            </Grid.Col>
            <Grid.Col
              offset={1}
              span={11}
            >
              <TextField
                label={String('Right icon')}
                name={`${focusIdx}.attributes.right-icon`}
              />
            </Grid.Col>
          </Grid.Row>

          <Grid.Row>
            <Grid.Col span={11}>
              <InputWithUnitField
                label={String('Icon width')}
                name={`${focusIdx}.attributes.icon-width`}
              />
            </Grid.Col>
            <Grid.Col
              offset={1}
              span={11}
            />
          </Grid.Row>
        </Collapse.Item>

        <Collapse.Item
          name='1'
          header={String('Border')}
        >
          <Grid.Row>
            <Grid.Col span={11}>
              <ColorPickerField
                label={String('Hovered border')}
                name={`${focusIdx}.attributes.tb-hover-border-color`}
              />
            </Grid.Col>
            <Grid.Col
              offset={1}
              span={11}
            >
              <ColorPickerField
                label={String('Selected Border')}
                name={`${focusIdx}.attributes.tb-selected-border-color`}
              />
            </Grid.Col>
          </Grid.Row>
          <Grid.Row>
            <Grid.Col span={11}>
              <TextField
                label={String('Border of the thumbnails')}
                name={`${focusIdx}.attributes.tb-border`}
              />
            </Grid.Col>
            <Grid.Col
              offset={1}
              span={11}
            >
              <TextField
                label={String('Border radius of the thumbnails')}
                name={`${focusIdx}.attributes.tb-border-radius`}
              />
            </Grid.Col>
          </Grid.Row>
        </Collapse.Item>
        <Collapse.Item
          name='4'
          header={String('Extra')}
        >
          <Grid.Col span={24}>
            <ClassName />
          </Grid.Col>
        </Collapse.Item>
      </CollapseWrapper>
    </AttributesPanelWrapper>
  );
}

function CarouselImage({
  item,
  index,
}: {
  item: ICarousel['data']['value']['images'];
  index: number;
}) {
  const { focusIdx } = useFocusIdx();
  const { onUploadImage } = useEditorProps();
  return (
    <Space direction='vertical'>
      <ImageUploaderField
        label={String('Image')}
        labelHidden
        name={`${focusIdx}.data.value.images.[${index}].src`}
        helpText={String(
          'The image suffix should be .jpg, jpeg, png, gif, etc. Otherwise, the picture may not be displayed normally.',
        )}
        uploadHandler={onUploadImage}
      />
      <Grid.Row>
        <Grid.Col span={11}>
          <TextField
            prefix={<IconLink />}
            label={String('Url')}
            name={`${focusIdx}.data.value.images.[${index}].href`}
          />
        </Grid.Col>
        <Grid.Col
          offset={1}
          span={11}
        >
          <SelectField
            label={String('Target')}
            name={`${focusIdx}.data.value.images.[${index}].target`}
            options={[
              {
                value: '',
                label: String('_self'),
              },
              {
                value: '_blank',
                label: String('_blank'),
              },
            ]}
          />
        </Grid.Col>
      </Grid.Row>

      <TextField
        label={String('Title')}
        name={`${focusIdx}.data.value.image.[${index}].title`}
      />
    </Space>
  );
}
