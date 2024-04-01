// Packages:
import React, { useEffect } from 'react';
import { useWindowSize } from 'react-use';
import { postMessageToParent } from '@demo/utils/SendDataToFlutter';
import { useDispatch } from 'react-redux';
import { JsonToMjml } from 'easy-email-core';
import { useMergeTagsModal } from './components/useMergeTagsModal';
import mjml from 'mjml-browser';

// Typescript:
import { AdvancedType } from 'easy-email-core';
import { CustomBlocksType } from './components/CustomBlocks/constants';
import { ExtensionProps } from 'easy-email-extensions';
import { MessageType } from '@demo/types/communication';
import { IEmailTemplate } from 'easy-email-editor';

// Constants:
import { testMergeTags } from './testMergeTags';

// Components:
import { BlockAvatarWrapper, EmailEditor } from 'easy-email-editor';
import { StandardLayout } from 'easy-email-extensions';
import { Message } from '@arco-design/web-react';

// Redux:
import template from '@demo/store/template';
import { generateTimestampID } from '.';

// Functions:
const InternalEditor = ({ values, submit, restart }: {
  values: any,
  submit: () => Promise<IEmailTemplate | undefined> | undefined;
  restart: (initialValues?: Partial<IEmailTemplate> | undefined) => void;
}) => {
  // Constants:
  const dispatch = useDispatch();
  const { width } = useWindowSize();
  const defaultCategories: ExtensionProps['categories'] = [
    {
      label: 'Content',
      active: true,
      blocks: [
        {
          type: AdvancedType.TEXT,
        },
        {
          type: AdvancedType.IMAGE,
          payload: { attributes: { padding: '0px 0px 0px 0px' } },
        },
        {
          type: AdvancedType.BUTTON,
        },
        {
          type: AdvancedType.SOCIAL,
        },
        {
          type: AdvancedType.DIVIDER,
        },
        {
          type: AdvancedType.SPACER,
        },
        {
          type: AdvancedType.HERO,
        },
        {
          type: AdvancedType.WRAPPER,
        },
      ],
    },
    {
      label: 'Layout',
      active: true,
      displayType: 'column',
      blocks: [
        {
          title: '2 columns',
          payload: [
            ['50%', '50%'],
            ['33%', '67%'],
            ['67%', '33%'],
            ['25%', '75%'],
            ['75%', '25%'],
          ],
        },
        {
          title: '3 columns',
          payload: [
            ['33.33%', '33.33%', '33.33%'],
            ['25%', '25%', '50%'],
            ['50%', '25%', '25%'],
          ],
        },
        {
          title: '4 columns',
          payload: [['25%', '25%', '25%', '25%']],
        },
      ],
    },
    {
      label: 'Custom',
      active: true,
      displayType: 'custom',
      blocks: [
        <BlockAvatarWrapper type={CustomBlocksType.PRODUCT_RECOMMENDATION}>
          <div
            style={{
              position: 'relative',
              border: '1px solid #ccc',
              marginBottom: 20,
              width: '80%',
              marginLeft: 'auto',
              marginRight: 'auto',
            }}
          >
            <img
              src={
                'http://res.cloudinary.com/dwkp0e1yo/image/upload/v1665841389/ctbjtig27parugrztdhk.png'
              }
              style={{
                maxWidth: '100%',
              }}
            />
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                zIndex: 2,
              }}
            />
          </div>
        </BlockAvatarWrapper>,
      ],
    },
  ];
  const { mergeTags } = useMergeTagsModal(testMergeTags);

  // Functions:
  const onSave = async (values: IEmailTemplate) => {
    Message.loading('Loading...');

    const jsonString = JSON.stringify(values.content);

    const currentJson = JSON.parse(window.CurrentJSON);

    const updatedjson = {
      'article_id': currentJson.article_id,
      'title': values?.subject,
      'summary': values?.subTitle,
      'picture': currentJson.picture,
      'category_id': currentJson.category_id,
      'origin_source': currentJson.origin_source,
      'readcount': currentJson.readcount,
      'user_id': currentJson.user_id,
      'secret': currentJson.secret,
      'level': currentJson.level,
      'created_at': currentJson.created_at,
      'updated_at': Date.now(),
      'deleted_at': currentJson.deleted_at,
      'content': {
        'article_id': currentJson.article_id,
        'content': jsonString,
      },
      'tags': currentJson.tags,
    };

    const mjmlString = JsonToMjml({
      data: values.content,
      mode: 'production',
      context: values.content,
      dataSource: mergeTags,
    });

    // const updatedhtml = mjml(mjmlString, {}).html


    const html2canvas = (await import('html2canvas')).default;
    const container = document.createElement('div');
    container.style.position = 'absolute';
    container.style.left = '-9999px';

    const html = mjml(mjmlString, {}).html;

    container.innerHTML = html;
    document.body.appendChild(container);

    const canvas = await html2canvas(container, { useCORS: true });

    // var base64Image
    //
    // canvas.toBlob(async (blob) => {
    //   if (blob) {
    //     const reader = new FileReader()
    //     reader.onload = () => {
    //       // The base64 string is available in reader.result
    //       base64Image = reader.result as string
    //       // Print the base64 image to the console
    //       console.log(base64Image)
    //       // Now you can do something with the base64Image, such as saving it or displaying it.
    //       // For example, you can save it as a file or display it as an image.
    //     }
    //     reader.readAsDataURL(blob)
    //   } else {
    //     // Handle the case where no blob was created
    //     console.error('Failed to create a blob from the canvas.')
    //   }
    // }, 'image/png', 0.1)
    const imageRequest = {
      messageType: MessageType.SAVE,
      key: generateTimestampID(),
      callType: 0,
      payLoad: JSON.stringify({
        'json': JSON.stringify(updatedjson),
        'image': 'base64Image',
        mergeTags,
      }),
      sender: 1,
    };
    postMessageToParent(imageRequest);
    // Message.clear()
  };

  const onParentMessage = async (event: MessageEvent<any>) => {
    try {
      const message = JSON.parse(event.data);
      if (message && message.messageType === MessageType.SAVE) {
        await onSave(values);
      }
    } catch (error) {
      // did not recieve a message
    }
  };

  // Effects:
  useEffect(() => {
    window.addEventListener('message', onParentMessage);

    return () => {
      window.removeEventListener('message', onParentMessage);
    };
  }, []);

  // Return:
  return (
    <>
      <StandardLayout
        compact={!(width < 1400)}
        categories={defaultCategories}
      >
        <EmailEditor />
      </StandardLayout>
    </>
  );
};

// Exports:
export default InternalEditor;
