// Packages:
import React, {
  useCallback,
  useEffect,
  useMemo,
  useState
} from 'react';
import { zipObject } from 'lodash';
import mjml from 'mjml-browser';
import services from '@demo/services';
import { pushEvent } from '@demo/utils/pushEvent';
import { JsonToMjml } from 'easy-email-core';
import useMergeTags from '../../hooks/useMergeTags';
import useConversationManager from '@demo/hooks/useConversationManager';
import { Uploader } from '@demo/utils/Uploader';
const imageCompression = import('browser-image-compression');

// Typescript:
declare global {
  interface Window {
    CurrentJSON: string;
  }
}

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
import { ConfigProvider, Message } from '@arco-design/web-react';
import { Loading } from '@demo/components/loading';
import { Liquid } from 'liquidjs';
import { saveAs } from 'file-saver';
import {
  EmailEditorProvider,
  EmailEditorProviderProps,
  IEmailTemplate,
} from 'easy-email-editor';
import {
  MjmlToJson,
} from 'easy-email-extensions';
// import './components/CustomBlocks';

// Redux:
import InternalEditor from './InternalEditor';
import { CallType, Sender } from '@demo/context/ConversationManagerContext';

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
    mergeTags,
    setMergeTags,
  } = useMergeTags();
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

  // const onChangeMergeTag = useCallback((path: string, val: any) => {
  //   setMergeTags(_mergeTags => {
  //     const mergeTags = cloneDeep(_mergeTags);
  //     set(mergeTags, path, val);
  //     return mergeTags;
  //   });
  // }, []);

  const onImportMJML = async ({
    restart,
  }: {
    restart: (val: IEmailTemplate) => void;
  }) => {
    const uploader = new Uploader(() => Promise.resolve(''), {
      accept: 'text/mjml',
      limit: 1,
    });

    const [file] = await uploader.chooseFile();
    const reader = new FileReader();
    const pageData = await new Promise<[string, IEmailTemplate['content']]>(
      (resolve, reject) => {
        reader.onload = event => {
          if (!event.target) {
            reject();
            return;
          }
          try {
            const pageData = MjmlToJson(event.target.result as any);
            resolve([file.name, pageData]);
          } catch (error) {
            reject();
          }
        };
        reader.readAsText(file);
      },
    );

    restart({
      subject: pageData[0],
      content: pageData[1],
      subTitle: '',
    });
  };

  const onImportJSON = async ({
    restart,
  }: {
    restart: (val: IEmailTemplate) => void;
  }) => {
    const uploader = new Uploader(() => Promise.resolve(''), {
      accept: 'application/json',
      limit: 1,
    });

    const [file] = await uploader.chooseFile();
    const reader = new FileReader();
    const emailTemplate = await new Promise<IEmailTemplate>((resolve, reject) => {
      reader.onload = event => {
        if (!event.target) {
          reject();
          return;
        }
        try {
          const template = JSON.parse(event.target.result as any) as IEmailTemplate;
          resolve(template);
        } catch (error) {
          reject();
        }
      };
      reader.readAsText(file);
    });

    restart({
      subject: emailTemplate.subject,
      content: emailTemplate.content,
      subTitle: emailTemplate.subTitle,
    });
  };

  const onExportMJML = (values: IEmailTemplate) => {
    const mjmlString = JsonToMjml({
      data: values.content,
      mode: 'production',
      context: values.content,
      dataSource: mergeTags,
    });

    pushEvent({ event: 'MJMLExport', payload: { values, mergeTags } });
    navigator.clipboard.writeText(mjmlString);
    saveAs(new Blob([mjmlString], { type: 'text/mjml' }), 'easy-email.mjml');
  };

  const onExportHTML = (values: IEmailTemplate) => {
    const mjmlString = JsonToMjml({
      data: values.content,
      mode: 'production',
      context: values.content,
      dataSource: mergeTags,
    });

    const html = mjml(mjmlString, {}).html;

    pushEvent({ event: 'HTMLExport', payload: { values, mergeTags } });
    navigator.clipboard.writeText(html);
    saveAs(new Blob([html], { type: 'text/html' }), 'easy-email.html');
  };

  const onExportJSON = (values: IEmailTemplate) => {
    // const jsonString = JSON.stringify(values, null, 2)

    // Log the JSON string to the console
    // console.log(jsonString)

    navigator.clipboard.writeText(JSON.stringify(values, null, 2));
    saveAs(
      new Blob([JSON.stringify(values, null, 2)], { type: 'application/json' }),
      'easy-email.json',
    );
  };

  const onExportImage = async (values: IEmailTemplate) => {
    Message.loading('Loading...');
    const html2canvas = (await import('html2canvas')).default;
    const container = document.createElement('div');
    container.style.position = 'absolute';
    container.style.left = '-9999px';
    const mjmlString = JsonToMjml({
      data: values.content,
      mode: 'production',
      context: values.content,
      dataSource: mergeTags,
    });

    const html = mjml(mjmlString, {}).html;

    container.innerHTML = html;
    document.body.appendChild(container);

    const blob = await new Promise<any>(resolve => {
      html2canvas(container, { useCORS: true }).then(canvas => {
        return canvas.toBlob(resolve, 'png', 0.1);
      });
    });
    saveAs(blob, 'demo.png');
    Message.clear();
  };

  const onBeforePreview: EmailEditorProviderProps['onBeforePreview'] = useCallback(
    (html: string, mergeTags: any) => {
      const engine = new Liquid();
      const tpl = engine.parse(html);
      return engine.renderSync(tpl, mergeTags);
    },
    [],
  );

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
              title: string;
              summary: string;
              content: string;
            };
            mergeTags: string[];
          };
          setTemplateData({
            content: JSON.parse(payload.template.content),
            subject: payload.template.title,
            subTitle: payload.template.summary,
          });
          setMergeTags(zipObject(payload.mergeTags, Array(payload.mergeTags.length).fill('')));
          setTemplateData((window as any).templateJSON);
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
          height={'calc(100vh - 68px)'}
          data={templateData}
          onUploadImage={onUploadImage}
          fontList={fontList}
          // onChangeMergeTag={onChangeMergeTag}
          autoComplete
          enabledLogic
          dashed={false}
          mergeTagGenerate={tag => `{{${tag}}}`}
          onBeforePreview={onBeforePreview}
          socialIcons={[]}
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
