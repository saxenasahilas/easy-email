// Packages:
import React, { useEffect, useState } from 'react';
import { useWindowSize } from 'react-use';
import useConversationManager from '@demo/hooks/useConversationManager';
import generatePreviewOfTemplate from '@demo/utils/generatePreviewOfTemplate';
import extractAttributes from '@demo/utils/extractAttributes';
import { AttributeModifier, getCustomAttributes, getPredefinedAttributes, setCustomAttributes } from 'attribute-manager';
import { difference, zipObject } from 'lodash';

// Typescript:
import { AdvancedType, BasicType, IPage } from 'easy-email-core';
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
    enablePublish,
    enableSave,
  } = useConversationManager();

  // State:
  const [enableFlutterPublish, setEnableFlutterPublish] = useState(false);
  const [enableFlutterSave, setEnableFlutterSave] = useState(false);

  // Functions:
  const extractThemeSettingsFromTemplate = (template: IPage) => {
    const themeSettings = {
      width: template?.attributes?.['width'],
      breakpoint: template?.data?.value?.['breakpoint'],
      fontFamily: template?.data?.value?.['font-family'],
      fontSize: template?.data?.value?.['font-size'],
      lineHeight: template?.data?.value?.['line-height'],
      fontWeight: template?.data?.value?.['font-weight'],
      textColor: template?.data?.value?.['text-color'],
      background: template?.attributes?.['background-color'],
      contentBackground: template?.data?.value?.['content-background-color'],
      userStyle: template?.data?.value?.['user-style'] ?? { content: undefined },
    };
    return themeSettings;
  };

  // Effects:
  useEffect(() => {
    (window as any).templateJSON = values;
  }, [values]);

  useEffect(() => {
    registerEventHandlers.onRequestSave(async message => {
      try {
        Message.loading('Loading...');
        const customAttributesArray = [...new Set(Object.keys(getCustomAttributes()))];
        const predefinedAttributesArray = [...new Set(Object.keys(getPredefinedAttributes()))];

        const combinedAttributeMap = {
          ...getCustomAttributes(),
          ...getPredefinedAttributes(),
        };

        const preview = await generatePreviewOfTemplate(values, combinedAttributeMap);
        const blockIDMap = sessionStorage.getItem('block-ids') ?? '{}';
        const blockIDs = Object.values(JSON.parse(blockIDMap) as Record<string, string>);
        const themeSettings = extractThemeSettingsFromTemplate(values.content);
        sendMessageToFlutter({
          conversationID: message.conversationID,
          conversationType: message.conversationType,
          callType: CallType.RESPONSE,
          payload: {
            template: {
              content: JSON.stringify(values.content),
              themeSettings,
            },
            attributes: {
              predefined: predefinedAttributesArray,
              custom: customAttributesArray,
            },
            blockIDs: {
              map: blockIDMap,
              list: blockIDs,
            },
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
    // It's dirty, because it contains both predefined and custom attributes.
    // Essentially, any attribute being used in the template is returned here.
    const extractedDirtyAttributesArray = extractAttributes(JSON.stringify(values?.content ?? {}));
    const predefinedAttributesArray = Object.keys(getPredefinedAttributes());
    const filteredCustomAttributes = difference(extractedDirtyAttributesArray, predefinedAttributesArray);
    setCustomAttributes(AttributeModifier.React, _ => zipObject(filteredCustomAttributes, Array(filteredCustomAttributes.length).fill('')));
  }, [values]);

  useEffect(() => {
    const extractedDirtyAttributesArray = extractAttributes(JSON.stringify(values?.content ?? {}));
    const extractedDirtyAttributes = zipObject(extractedDirtyAttributesArray, Array(extractedDirtyAttributesArray.length).fill(''));

    const areMergeTagsBeingUsedInTheTemplate = Object.values(extractedDirtyAttributes).length > 0;
    if (areMergeTagsBeingUsedInTheTemplate && !enableFlutterPublish) {
      enablePublish(true);
      setEnableFlutterPublish(true);
    } else if (!areMergeTagsBeingUsedInTheTemplate && enableFlutterPublish) {
      enablePublish(false);
      setEnableFlutterPublish(false);
    }
  }, [values, enableFlutterPublish]);

  useEffect(() => {
    if ((values?.content?.children?.length ?? 0) > 0 && !enableFlutterSave) {
      enableSave(true);
      setEnableFlutterSave(true);
    } else if ((values?.content?.children?.length ?? 0) === 0 && enableFlutterSave) {
      enableSave(false);
      setEnableFlutterSave(false);
    }
  }, [values, enableFlutterSave]);

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
