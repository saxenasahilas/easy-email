// Packages:
import React, {
  useCallback,
  useEffect,
  useMemo,
  useState
} from 'react';
import { useDispatch } from 'react-redux';
import { useAppSelector } from '@demo/hooks/useAppSelector';
import { useLoading } from '@demo/hooks/useLoading';
import { useHistory } from 'react-router-dom';
import { cloneDeep, set, isEqual } from 'lodash';
import { useEmailModal } from './components/useEmailModal';
import mjml from 'mjml-browser';
import services from '@demo/services';
import { pushEvent } from '@demo/utils/pushEvent';
import { JsonToMjml } from 'easy-email-core';
import { useMergeTagsModal } from './components/useMergeTagsModal';
import { Uploader } from '@demo/utils/Uploader';
import axios from 'axios';
import { postMessageToParent } from '@demo/utils/SendDataToFlutter';
const imageCompression = import('browser-image-compression');

// Typescript:
import { FormApi } from 'final-form';
import { AdvancedType, IBlockData } from 'easy-email-core';
import { CustomBlocksType } from './components/CustomBlocks/constants';
import { MessageType } from '@demo/types/communication';

declare global {
  interface Window {
    CurrentJSON: string;
  }
}

// Imports:
import { IconMoonFill, IconSunFill } from '@arco-design/web-react/icon';
import 'easy-email-editor/lib/style.css';
import 'easy-email-extensions/lib/style.css';
import blueTheme from '@arco-themes/react-easy-email-theme/css/arco.css?inline';
import purpleTheme from '@arco-themes/react-easy-email-theme-purple/css/arco.css?inline';
import greenTheme from '@arco-themes/react-easy-email-theme-green/css/arco.css?inline';

// Constants:
import { testMergeTags } from './testMergeTags';
import localesData from 'easy-email-localization/locales/locales.json';
import enUS from '@arco-design/web-react/es/locale/en-US';

// Components:
import {
  Button,
  ConfigProvider,
  Dropdown,
  Form,
  Input,
  Menu,
  Message,
  Modal,
  PageHeader,
  Select,
} from '@arco-design/web-react';
import { Loading } from '@demo/components/loading';
import { Liquid } from 'liquidjs';
import { saveAs } from 'file-saver';
import {
  BlockAvatarWrapper,
  EmailEditor,
  EmailEditorProvider,
  EmailEditorProviderProps,
  IEmailTemplate,
} from 'easy-email-editor';
import { Stack } from '@demo/components/Stack';
import {
  ExtensionProps,
  MjmlToJson,
  StandardLayout,
} from 'easy-email-extensions';
import './components/CustomBlocks';

// Redux:
import template from '@demo/store/template';
import InternalEditor from './InternalEditor';

// Functions:
export const generateTimestampID = () => {
  const timestamp = Date.now();
  const id = 'req' + timestamp;
  return id;
};

const Editor = () => {
  // Constants:
  const id = generateTimestampID();
  const dispatch = useDispatch();
  const history = useHistory();
  const templateData = useAppSelector('template');
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
  const emailPattern =
    // eslint-disable-next-line
    /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i;
  const { modal } = useEmailModal();
  const loading = useLoading(template.loadings.fetchByJson);
  const {
    openModal: openMergeTagsModal,
    modal: mergeTagsModal,
    mergeTags,
    setMergeTags,
  } = useMergeTagsModal(testMergeTags);
  const isSubmitting = useLoading([
    template.loadings.create,
    template.loadings.updateById,
  ]);

  // State:
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [theme, setTheme] = useState<'blue' | 'green' | 'purple'>('blue');
  const [locale, setLocale] = useState('en');
  const [visible, setVisible] = useState(false);
  const [text, setText] = useState('');

  // Memo:
  const initialValues: IEmailTemplate | null = useMemo(() => {
    if (!templateData) return null;
    const sourceData = cloneDeep(templateData.content) as IBlockData;
    return {
      ...templateData,
      content: sourceData, // replace standard block
    };
  }, [templateData]);

  const themeStyleText = useMemo(() => {
    if (theme === 'green') return greenTheme;
    if (theme === 'purple') return purpleTheme;
    return blueTheme;
  }, [theme]);

  // Functions:
  const postEmail = async () => {
    if (!emailPattern.test(text)) {
      Message.error('Please enter a valid email address');
      return;
    }
    pushEvent({
      event: 'TryNewEditor',
      payload: { email: text },
    });
    await axios.post(`/api/email`, {
      email: text,
    });
    setVisible(false);
  };

  const onUploadImage = async (blob: Blob) => {
    const compressionFile = await (
      await imageCompression
    ).default(blob as File, {
      maxWidthOrHeight: 1440,
    });
    return services.common.uploadByQiniu(compressionFile);
  };

  const onChangeTheme = useCallback((newTheme: "blue" | "green" | "purple") => {
    setTheme(newTheme);
  }, []);

  const onChangeMergeTag = useCallback((path: string, val: any) => {
    setMergeTags((_mergeTags: any) => {
      const mergeTags = cloneDeep(_mergeTags);
      set(mergeTags, path, val);
      return mergeTags;
    });
  }, []);

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

  const onSubmit = useCallback(
    async (
      values: IEmailTemplate,
      form: FormApi<IEmailTemplate, Partial<IEmailTemplate>>,
    ) => {
      pushEvent({ event: 'EmailSave' });
      if (id) {
        const isChanged = !(
          isEqual(initialValues?.content, values.content) &&
          isEqual(initialValues?.subTitle, values?.subTitle) &&
          isEqual(initialValues?.subject, values?.subject)
        );

        if (!isChanged) {
          Message.success('Updated success!');
          form.restart(values);
          return;
        }
        dispatch(
          template.actions.updateById({
            id: +id,
            template: values,
            success() {
              Message.success('Updated success!');
              form.restart(values);
            },
          }),
        );
      } else {
        dispatch(
          template.actions.create({
            template: values,
            success(id, newTemplate) {
              Message.success('Saved success!');
              form.restart(newTemplate);
              history.replace(`/editor?id=${id}`);
            },
          }),
        );
      }
    },
    [dispatch, history, id, initialValues],
  );

  const onBeforePreview: EmailEditorProviderProps['onBeforePreview'] = useCallback(
    (html: string, mergeTags: any) => {
      const engine = new Liquid();
      const tpl = engine.parse(html);
      return engine.renderSync(tpl, mergeTags);
    },
    [],
  );

  const onParentMessage = (event: MessageEvent<any>, json: any) => {
    try {
      console.log('A RECEIVED: ', event);
      const message = JSON.parse(event.data);
      if (!message) {
        dispatch(template.actions.fetchByJson({ json }));
      } else if (message.messageType === MessageType.TEMPLATE) {
        window.CurrentJSON = message.payLoad;
        dispatch(template.actions.fetchByJson({ json: message.payLoad }));
        const responseMessage = {
          messageType: MessageType.TEMPLATE,
          key: message.key,
          callType: 1,
          payLoad: 'template received',
          sender: 1,
        };

        postMessageToParent(responseMessage);
      }
    } catch (error) {
      // did not recieve a message
    }
  };

  // Effects:
  useEffect(() => {
    const jsonData = {
      'article_id': 815,
      'title': 'Sphero - Newsletter',
      'summary': 'Nice to meet you!',
      'picture': 'https://assets.maocanhua.cn/4262aa6d-5d8e-4774-8f7c-1af28cb18ed4-',
      'category_id': 96,
      'origin_source': '',
      'readcount': 11,
      'user_id': 107,
      'secret': 0,
      'level': 10,
      'created_at': Date.now(),
      'updated_at': Date.now(),
      'deleted_at': 0,
      'content': {
        'article_id': 815,
        'content': `{\"type\":\"page\",\"data\":{\"value\":{\"breakpoint\":\"480px\",\"headAttributes\":\"\",\"font-size\":\"14px\",\"font-weight\":\"400\",\"line-height\":\"1.7\",\"headStyles\":[],\"fonts\":[],\"responsive\":true,\"font-family\":\"-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans','Helvetica Neue', sans-serif\",\"text-color\":\"#000000\"}},\"attributes\":{\"background-color\":\"#efeeea\",\"width\":\"600px\"},\"children\":[{\"type\":\"advanced_wrapper\",\"data\":{\"value\":{}},\"attributes\":{\"padding\":\"20px 0px 20px 0px\",\"border\":\"none\",\"direction\":\"ltr\",\"text-align\":\"center\"},\"children\":[]}]}`
      },
      'tags': [
        {
          'tag_id': 74,
          'name': '券包',
          'picture': 'http://assets.maocanhua.cn/Fqpjw0PHvSPy4sh0giFmkpuxgKhU',
          'desc': '券包',
          'created_at': 1576227276,
          'user_id': 77,
          'updated_at': 0,
          'deleted_at': 0
        }
      ]
    };
    window.CurrentJSON = JSON.stringify(jsonData);
    dispatch(template.actions.fetchByJson({ json: JSON.stringify(jsonData) }));

    const handleParentMessage = (event: MessageEvent<any>) => onParentMessage(event, jsonData);
    window.addEventListener('message', handleParentMessage);

    const initializationMessage = {
      messageType: MessageType.INITIATE,
      key: generateTimestampID(),
      callType: 0,
      payLoad: 'ready to receive',
      sender: 1,
    };
    postMessageToParent(initializationMessage);

    return () => {
      dispatch(template.actions.set(null));
      window.removeEventListener('message', handleParentMessage);
    };
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.body.setAttribute('arco-theme', 'dark');
    } else {
      document.body.removeAttribute('arco-theme');
    }
  }, [isDarkMode]);

  // Return:
  if (!templateData && loading) {
    return (
      <Loading loading={loading}>
        <div style={{ height: '100vh' }} />
      </Loading>
    );
  }

  if (!initialValues) return null;

  return (
    <ConfigProvider locale={enUS}>
      <div>
        <style>{themeStyleText}</style>
        <EmailEditorProvider
          key={id}
          height={'calc(100vh - 68px)'}
          data={initialValues}
          // interactiveStyle={{
          //   hoverColor: '#78A349',
          //   selectedColor: '#1890ff',
          // }}
          // onAddCollection={addCollection}
          // onRemoveCollection={({ id }) => removeCollection(id)}
          onUploadImage={onUploadImage}
          fontList={fontList}
          onSubmit={onSubmit}
          onChangeMergeTag={onChangeMergeTag}
          autoComplete
          enabledLogic
          // enabledMergeTagsBadge
          dashed={false}
          mergeTags={mergeTags}
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
        {modal}
        {mergeTagsModal}
        <Modal
          title={<p style={{ textAlign: 'left' }}>Leave your email</p>}
          visible={visible}
          onCancel={() => setVisible(false)}
          onOk={postEmail}
        >
          <Form.Item label='Email'>
            <Input
              value={text}
              onChange={setText}
            />
          </Form.Item>
        </Modal>
        <style>{`#bmc-wbtn {display:none !important}`}</style>
      </div>
    </ConfigProvider>
  );
};

// Exports:
export default Editor;
