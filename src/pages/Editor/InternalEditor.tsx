// Packages:
import React, { useEffect } from 'react';
import { useWindowSize } from 'react-use';
import useConversationManager from '@demo/hooks/useConversationManager';
import generatePreviewOfTemplate from '@demo/utils/generatePreviewOfTemplate';
import extractMergeTags from '@demo/utils/extractMergeTags';
import { MergeTagModifier, getMergeTags, setMergeTags } from 'merge-tag-manager';
import { zipObject } from 'lodash';

// Typescript:
import { AdvancedType, BasicType } from 'easy-email-core';
import { BlockAttributeConfigurationManager, ExtensionProps } from 'easy-email-extensions';
import { IEmailTemplate } from 'easy-email-editor';

// Components:
import { EmailEditor } from 'easy-email-editor';
import { StandardLayout } from 'easy-email-extensions';
import CustomPagePanel from './components/CustomPanels/CustomPagePanel';
import { Message } from '@arco-design/web-react';

// Redux:
import { CallType } from '@demo/context/ConversationManagerContext';

// Functions:
BlockAttributeConfigurationManager.add({
  [BasicType.PAGE]: CustomPagePanel
});

const InternalEditor = ({ values }: {
  values: IEmailTemplate,
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
  const {
    registerEventHandlers,
    sendMessageToFlutter,
  } = useConversationManager();

  // Effects:
  useEffect(() => {
    (window as any).templateJSON = values;
  }, [values]);

  useEffect(() => {
    registerEventHandlers.onRequestSave(async message => {
      try {
        Message.loading('Loading...');
        const mergeTagsArray = [...new Set(Object.keys(getMergeTags()))];
        const preview = await generatePreviewOfTemplate(values, getMergeTags());
        sendMessageToFlutter({
          conversationID: message.conversationID,
          conversationType: message.conversationType,
          callType: CallType.RESPONSE,
          payload: {
            template: {
              title: values.subject,
              summary: values.subTitle,
              content: JSON.stringify(values.content)
            },
            mergeTags: mergeTagsArray,
            preview,
          },
        });
        Message.clear();
        Message.success('Template saved successfully!');
      } catch (error) {
        Message.clear();
        console.error('Encountered an error while trying to save the template', error);
        Message.error('Could not save template!');
      }
    });
  }, [values]);

  useEffect(() => {
    const extractMergeTagsArray = extractMergeTags({ content: JSON.stringify(values.content), summary: values.subTitle, title: values.subject });
    setMergeTags(MergeTagModifier.React, _ => zipObject(extractMergeTagsArray, Array(extractMergeTagsArray.length).fill('')));
  }, [values]);

  // Return:
  return (
    <>
      {/** @ts-ignore */}
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
