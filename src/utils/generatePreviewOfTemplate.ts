// Packages:
import html2canvas from 'html2canvas';

// Functions:
const generatePreviewOfTemplate = async (html: string) => {
  const container = document.createElement('div');
  container.style.position = 'absolute';
  container.style.left = '-9999px';
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

  document.body.removeChild(container);
  return base64Image;
};

// Exports:
export default generatePreviewOfTemplate;
