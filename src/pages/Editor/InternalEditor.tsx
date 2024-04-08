// Packages:
import React, { useEffect } from 'react';
import { useWindowSize } from 'react-use';
import useMergeTags from '../../hooks/useMergeTags';
import { cloneDeep, isEqual } from 'lodash';

// Typescript:
import { AdvancedType, BasicType } from 'easy-email-core';
import { BlockAttributeConfigurationManager, ExtensionProps } from 'easy-email-extensions';
import { IEmailTemplate } from 'easy-email-editor';

// Components:
import { EmailEditor } from 'easy-email-editor';
import { StandardLayout } from 'easy-email-extensions';
import CustomPagePanel from './components/CustomPanels/CustomPagePanel';

// Redux:
import useConversationManager from '@demo/hooks/useConversationManager';
import { CallType } from '@demo/context/ConversationManagerContext';
import generatePreviewOfTemplate from '@demo/utils/generatePreviewOfTemplate';

// Functions:
BlockAttributeConfigurationManager.add({
  [BasicType.PAGE]: CustomPagePanel
});

const InternalEditor = ({ values, submit, restart }: {
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
  const { mergeTags } = useMergeTags();
  const {
    internalTemplateData,
    setInternalTemplateData,
    registerEventHandlers,
    sendMessageToFlutter,
  } = useConversationManager();

  // Effects:
  useEffect(() => {
    if (!isEqual(internalTemplateData, values)) {
      const newInternalTemplateData = cloneDeep(values);
      setInternalTemplateData(newInternalTemplateData);
    }
  }, [internalTemplateData, values]);

  useEffect(() => {
    registerEventHandlers.onRequestSave(async (message) => {
      sendMessageToFlutter({
        conversationID: message.conversationID,
        conversationType: message.conversationType,
        callType: CallType.RESPONSE,
        payload: {
          template: values,
          mergeTags,
          preview: await generatePreviewOfTemplate(values, mergeTags)
        },
      });
    });
  }, [values, mergeTags]);

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
