import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import TurndownService from 'turndown';

const sanitiseFileName = (title, extension) => {
  const safe = title.trim().replace(/[^a-zA-Z0-9-_ ]/g, '').replace(/\s+/g, ' ').trim();
  return `${safe || 'document'}.${extension}`;
};

const createTemporaryHtmlContainer = (html) => {
  const container = document.createElement('div');
  container.style.position = 'fixed';
  container.style.left = '-9999px';
  container.style.top = '0';
  container.style.width = '800px';
  container.style.padding = '24px';
  container.style.background = '#ffffff';
  container.innerHTML = html;
  document.body.appendChild(container);
  return container;
};

export const exportMarkdown = async (htmlOrElement, title) => {
  const html = typeof htmlOrElement === 'string' ? htmlOrElement : htmlOrElement.innerHTML;
  const turndown = new TurndownService({ headingStyle: 'atx' });
  turndown.addRule('underline', {
    filter: ['u'],
    replacement: (content) => `_${content}_`
  });

  const markdown = turndown.turndown(html);
  const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8' });
  const fileName = sanitiseFileName(title, 'md');

  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
};

export const exportPdf = async (htmlOrElement, title) => {
  const container =
    typeof htmlOrElement === 'string'
      ? createTemporaryHtmlContainer(htmlOrElement)
      : htmlOrElement;

  try {
    const canvas = await html2canvas(container, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#ffffff'
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({ unit: 'pt', format: 'a4' });
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = pageWidth - 40;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    let position = 20;
    pdf.addImage(imgData, 'PNG', 20, position, imgWidth, imgHeight);

    if (imgHeight > pageHeight - 40) {
      position += imgHeight;
      while (position > pageHeight - 20) {
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 20, 20, imgWidth, imgHeight);
        position -= pageHeight - 40;
      }
    }

    pdf.save(sanitiseFileName(title, 'pdf'));
  } finally {
    if (typeof htmlOrElement === 'string' && container.parentNode) {
      container.parentNode.removeChild(container);
    }
  }
};
