// Packages:
import React, { useEffect } from 'react';
import { useWindowSize } from 'react-use';
import { postMessageToParent } from '@demo/utils/SendDataToFlutter';
import { JsonToMjml } from 'easy-email-core';
import useMergeTags from './components/useMergeTags';
import mjml from 'mjml-browser';

// Typescript:
import { AdvancedType, BasicType } from 'easy-email-core';
import { BlockAttributeConfigurationManager, ExtensionProps } from 'easy-email-extensions';
import { MessageType } from '@demo/types/communication';
import { IEmailTemplate } from 'easy-email-editor';

// Components:
import { EmailEditor } from 'easy-email-editor';
import { StandardLayout } from 'easy-email-extensions';
import { Message } from '@arco-design/web-react';
import CustomPagePanel from './components/CustomPanels/CustomPagePanel';

// Redux:
import { generateTimestampID } from '.';

// Functions:
BlockAttributeConfigurationManager.add({
  [BasicType.PAGE]: CustomPagePanel
});

const InternalEditor = ({ values, submit, restart }: {
  values: any,
  submit: () => Promise<IEmailTemplate | undefined> | undefined;
  restart: (initialValues?: Partial<IEmailTemplate> | undefined) => void;
}) => {
  // Constants:
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
  ];
  const { mergeTags } = useMergeTags();

  // Functions:
  const onSave = (values: IEmailTemplate) => {
    Message.loading('Loading...');

    const jsonString = JSON.stringify(values.content);

    const currentJSON = JSON.parse(window.CurrentJSON);

    const updatedJSON = {
      'article_id': currentJSON.article_id,
      'title': values?.subject,
      'summary': values?.subTitle,
      'picture': currentJSON.picture,
      'category_id': currentJSON.category_id,
      'origin_source': currentJSON.origin_source,
      'readcount': currentJSON.readcount,
      'user_id': currentJSON.user_id,
      'secret': currentJSON.secret,
      'level': currentJSON.level,
      'created_at': currentJSON.created_at,
      'updated_at': Date.now(),
      'deleted_at': currentJSON.deleted_at,
      'content': {
        'article_id': currentJSON.article_id,
        'content': jsonString,
      },
      'tags': currentJSON.tags,
    };
    console.log('updatedJSON', updatedJSON);

    const mjmlString = JsonToMjml({
      data: values.content,
      mode: 'production',
      context: values.content,
      dataSource: mergeTags,
    });

    // const updatedhtml = mjml(mjmlString, {}).html


    // const html2canvas = (await import('html2canvas')).default;
    const container = document.createElement('div');
    container.style.position = 'absolute';
    container.style.left = '-9999px';

    const html = mjml(mjmlString, {}).html;

    container.innerHTML = html;
    document.body.appendChild(container);

    // const canvas = await html2canvas(container, { useCORS: true });

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
    const saveRequest = {
      messageType: MessageType.SAVE,
      key: generateTimestampID(),
      callType: 0,
      payLoad: JSON.stringify({
        'json': JSON.stringify(updatedJSON),
        'image': 'base64Image',
        mergeTags,
      }),
      sender: 1,
    };
    postMessageToParent(saveRequest);
    Message.clear();
  };

  const onParentMessage = async (event: MessageEvent<any>) => {
    try {
      const message = JSON.parse(event.data);
      if (message && message.messageType === MessageType.SAVE) {
        onSave(values);
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
  }, [values]);

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
