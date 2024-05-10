// Packages:
import React, {
  useEffect,
  useMemo,
  useState
} from 'react';
import { zipObject } from 'lodash';
import services from '@demo/services';
import useConversationManager from '@demo/hooks/useConversationManager';
const imageCompression = import('browser-image-compression');
import {
  AttributeModifier,
  setCustomAttributes,
  setPredefinedAttributes,
} from 'attribute-manager';
import { isJSONStringValid } from '@demo/utils/isJSONStringValid';

// Typescript:
declare global {
  interface Window {
    CurrentJSON: string;
  }
}
import { CallType, Sender } from '@demo/context/ConversationManagerContext';

// Imports:
import 'easy-email-editor/lib/style.css';
import 'easy-email-extensions/lib/style.css';
import blueTheme from '@arco-themes/react-easy-email-theme/css/arco.css?inline';
import purpleTheme from '@arco-themes/react-easy-email-theme-purple/css/arco.css?inline';
import greenTheme from '@arco-themes/react-easy-email-theme-green/css/arco.css?inline';

// Constants:
import localesData from 'easy-email-localization/locales/locales.json';
import enUS from '@arco-design/web-react/es/locale/en-US';

// Components:
import { ConfigProvider } from '@arco-design/web-react';
import { Loading } from '@demo/components/loading';
import InternalEditor from './InternalEditor';
// import './components/CustomBlocks';

// Redux:
import {
  EmailEditorProvider,
  IEmailTemplate,
} from 'easy-email-editor';

// Functions:
export const generateTimestampID = () => {
  const timestamp = Date.now();
  const id = 'req' + timestamp;
  return id;
};

const Editor = () => {
  // Constants:
  const id = generateTimestampID();
  const fontList = [
    'Arial',
    'Tahoma',
    'Verdana',
    'Times New Roman',
    'Courier New',
    'Georgia',
    'Lato',
    'Montserrat',
    '黑体',
    '仿宋',
    '楷体',
    '标楷体',
    '华文仿宋',
    '华文楷体',
    '宋体',
    '微软雅黑',
  ].map(item => ({ value: item, label: item }));
  const {
    acknowledgeAndEndConversation,
    doesFlutterKnowThatReactIsReady,
    getTemplate,
  } = useConversationManager();

  // State:
  const [isLoading, setIsLoading] = useState(true);
  const [templateData, setTemplateData] = useState<IEmailTemplate>();
  const [isDarkMode] = useState(false);
  const [theme] = useState<'blue' | 'green' | 'purple'>('blue');
  const [locale] = useState('en');

  // Memo:
  const themeStyleText = useMemo(() => {
    if (theme === 'green') return greenTheme;
    if (theme === 'purple') return purpleTheme;
    return blueTheme;
  }, [theme]);

  // Functions:
  const onUploadImage = async (blob: Blob) => {
    const compressionFile = await (
      await imageCompression
    ).default(blob as File, {
      maxWidthOrHeight: 1440,
    });
    return services.common.uploadByQiniu(compressionFile);
  };

  const modifyTemplateAccordingToThemeSettings = (template: {
    content: string;
    themeSettings: {
      width?: string;
      breakpoint?: string;
      fontFamily?: string;
      fontSize?: string;
      lineHeight?: string;
      fontWeight?: string;
      textColor?: string;
      background?: string;
      contentBackground?: string;
      userStyle?: string;
    };
  }) => {
    let content = JSON.parse(template.content);
    content.attributes = {
      ...content.attributes,
      'background-color': template.themeSettings.background ?? content.attributes['background-color'],
      'width': template.themeSettings.width ?? content.attributes['width'],
    };
    content.data.value = {
      ...content.data.value,
      'breakpoint': template.themeSettings.breakpoint ?? content.data.value['breakpoint'],
      'font-family': template.themeSettings.fontFamily ?? content.data.value['font-family'],
      'font-size': template.themeSettings.fontSize ?? content.data.value['font-size'],
      'font-weight': template.themeSettings.fontWeight ?? content.data.value['font-weight'],
      'line-height': template.themeSettings.lineHeight ?? content.data.value['line-height'],
      'text-color': template.themeSettings.textColor ?? content.data.value['text-color'],
      'content-background-color': template.themeSettings.contentBackground ?? content.data.value?.['content-background-color'],
      'user-style': {
        ...content.data.value?.['user-style'],
        'content': template.themeSettings.contentBackground ?? content.data.value?.['user-style']?.['content'],
      }
    };
    return content;
  };

  // Effects:
  useEffect(() => {
    if (doesFlutterKnowThatReactIsReady && !templateData) {
      getTemplate(async (message) => {
        if (
          message.callType === CallType.RESPONSE &&
          message.payload &&
          message.sender === Sender.FLUTTER
        ) {
          const payload = JSON.parse(message.payload) as {
            template: {
              type: string;
              content: string;
              themeSettings: {
                width?: string;
                breakpoint?: string;
                fontFamily?: string;
                fontSize?: string;
                lineHeight?: string;
                fontWeight?: string;
                textColor?: string;
                background?: string;
                contentBackground?: string;
                userStyle?: string;
              };
            };
            attributes: {
              predefined: string[];
              custom: string[];
            };
            blockIDs: {
              map: string;
            };
          };

          sessionStorage.setItem('template-type', payload.template.type ?? 'EMAIL');
          sessionStorage.setItem('block-ids', isJSONStringValid(payload.blockIDs?.map) ? payload.blockIDs?.map : '{}');

          setTemplateData({
            content: modifyTemplateAccordingToThemeSettings(payload.template),
            subject: '',
            subTitle: '',
          });
          setCustomAttributes(AttributeModifier.React, _customAttributes => ({
            ...zipObject(payload.attributes.custom, Array(payload.attributes.custom.length).fill('')),
          }));
          setPredefinedAttributes(AttributeModifier.React, _predefinedAttributes => ({
            ...zipObject(payload.attributes.predefined, Array(payload.attributes.predefined.length).fill('')),
            // example: 'https://images.pexels.com/photos/21936231/pexels-photo-21936231/free-photo-of-a-stork-is-sitting-on-top-of-a-nest.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
          }));
          // setTemplateData((window as any).templateJSON);
          setIsLoading(false);
          acknowledgeAndEndConversation(message.conversationID);
        }
      });
    }
  }, [doesFlutterKnowThatReactIsReady, templateData]);

  useEffect(() => {
    if (isDarkMode) {
      document.body.setAttribute('arco-theme', 'dark');
    } else {
      document.body.removeAttribute('arco-theme');
    }
  }, [isDarkMode]);

  // Return:
  if (!templateData && isLoading) {
    return (
      <Loading loading={isLoading}>
        <div style={{ height: '100vh' }} />
      </Loading>
    );
  }

  if (!templateData) return null;

  return (
    <ConfigProvider locale={enUS}>
      <div>
        <style>{themeStyleText}</style>
        <EmailEditorProvider
          key={id}
          height={'calc(100vh - 1px)'}
          data={templateData}
          onUploadImage={onUploadImage}
          fontList={fontList}
          // onChangeMergeTag={onChangeMergeTag}
          autoComplete
          enabledLogic
          dashed={false}
          mergeTagGenerate={tag => `{{${tag}}}`}
          // onBeforePreview={onBeforePreview}
          socialIcons={[]}
          enabledMergeTagsBadge
          locale={localesData[locale]}
        >
          {({ values }, { submit, restart }) => (
            <InternalEditor
              values={values}
              submit={submit}
              restart={restart}
            />
          )}
        </EmailEditorProvider>
        <style>{`#bmc-wbtn {display:none !important}`}</style>
      </div>
    </ConfigProvider>
  );
};

// Exports:
export default Editor;
