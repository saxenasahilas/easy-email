// Packages:
import html2canvas from 'html2canvas';
import { JsonToMjml } from 'easy-email-core';
import mjml from 'mjml-browser';

// Typescript:
import { IEmailTemplate } from 'easy-email-editor';

// Components:
import { Message } from '@arco-design/web-react';

// Functions:
const generatePreviewOfTemplate = async (templateData: IEmailTemplate, mergeTags: Record<string, string>) => {
  const mjmlString = JsonToMjml({
    data: templateData.content,
    mode: 'production',
    context: templateData.content,
    dataSource: mergeTags,
  });

  const container = document.createElement('div');
  container.style.position = 'absolute';
  container.style.left = '-9999px';

  const html = mjml(mjmlString, {}).html;

  container.innerHTML = html;
  document.body.appendChild(container);

  const canvas = await html2canvas(container, { useCORS: true });

  let base64Image = '';
  try {
    base64Image = await new Promise<string>((resolve, reject) => {
      canvas.toBlob(async blob => {
        if (blob) {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.readAsDataURL(blob);
        } else reject();
      }, 'image/png', 0.1);
    });
  } catch (error) {
    console.error('Failed to create a blob from the canvas.');
  }

  return base64Image;
};

// Exports:
export default generatePreviewOfTemplate;
