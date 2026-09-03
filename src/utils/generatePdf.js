import { jsPDF } from 'jspdf';

export function downloadPdf(document, values) {
  const pdf = new jsPDF({
    unit: 'mm',
    format: 'a4',
  });

  const margin = 25;
  const width = 210 - margin * 2;
  let y = 25;

  const addWrapped = (text, options = {}) => {
    const size = options.size ?? 12;
    const bold = options.bold ?? false;
    const align = options.align ?? 'left';
    const gap = options.gap ?? 7;
    const maxWidth = options.maxWidth ?? width;

    pdf.setFont('times', bold ? 'bold' : 'normal');
    pdf.setFontSize(size);

    const lines = pdf.splitTextToSize(text, maxWidth);

    lines.forEach((line) => {
      if (align === 'center') {
        pdf.text(line, 105, y, { align: 'center' });
      } else if (align === 'right') {
        const xPos = 210 - margin;
        pdf.text(line, xPos, y, { align: 'right' });
      } else {
        pdf.text(line, margin, y);
      }
      y += gap;
    });

    y += 1;

    return y;
  };

  // Check if it's an affidavit document
  if (
    document.key === 'affidavitNonMembership' ||
    document.key === 'affidavitGoodConduct'
  ) {
    generateAffidavitPdf(pdf, document, values, addWrapped, margin, width);
    pdf.save(`${slug(document.name)}.pdf`);
    return;
  }

  // Regular document generation
  document
    .renderAddress(values)
    .forEach((line) => addWrapped(line, { size: 12, gap: 6, align: 'right' }));

  y += 2;
  addWrapped(document.renderDate(values), { size: 12, gap: 6, align: 'right' });
  y += 3;

  document.recipient.forEach((line) =>
    addWrapped(resolve(line, values), { size: 12, gap: 6 }),
  );

  y += 2;
  addWrapped(resolve(document.salutation, values), { size: 12, gap: 6 });

  y += 3;
  addWrapped(document.title, {
    size: 12,
    bold: true,
    align: 'center',
    gap: 6,
  });

  y += 2;

  document.renderBody(values).forEach((text) => {
    addWrapped(text, { size: 12, gap: 6 });
    y += 2;
  });

  addWrapped('Thanks.', { size: 12, gap: 6 });
  y += 3;
  addWrapped('Yours faithfully,', { size: 12, gap: 6 });

  if (values.signature && values.signature.startsWith('data:image')) {
    y += 5;
    try {
      const imgWidth = 40;
      const imgHeight = 15;
      pdf.addImage(values.signature, 'JPEG', margin, y, imgWidth, imgHeight);
      y += imgHeight + 2;
    } catch (e) {
      console.warn('Could not add signature image:', e);
      y += 12;
    }
  } else {
    y += 12;
  }

  addWrapped(resolve(document.signature, values), {
    size: 12,
    bold: true,
    gap: 6,
  });

  pdf.save(`${slug(document.name)}.pdf`);
}

function generateAffidavitPdf(
  pdf,
  document,
  values,
  addWrapped,
  margin,
  width,
) {
  // Title - centered, bold
  addWrapped(document.title, {
    size: 14,
    bold: true,
    align: 'center',
    gap: 10,
  });

  // Subtitle - centered, bold
  if (document.subtitle) {
    const subtitleLines = document.subtitle.split('\n');

    subtitleLines.forEach((line) => {
      addWrapped(line, {
        size: 12,
        bold: true,
        align: 'center',
        gap: 8,
      });
    });
  }

  // Extra spacing after subtitle
  addWrapped('', {
    size: 1,
    gap: 8,
  });

  const bodyParagraphs = document.renderBody(values);

  // Find DEPONENT
  const deponentIndex = bodyParagraphs.findIndex(
    (p) => typeof p === 'object' && p.text === 'DEPONENT',
  );

  // Render everything before DEPONENT
  bodyParagraphs.slice(0, deponentIndex).forEach((paragraph) => {
    if (typeof paragraph === 'string') {
      addWrapped(paragraph, {
        size: 11,
        gap: 8,
        align: 'justify',
      });
    } else {
      addWrapped(paragraph.text, {
        size: 11,
        gap: 8,
        align: paragraph.align || 'justify',
        bold: paragraph.bold || false,
      });
    }
  });

  // Render DEPONENT and everything after it
  bodyParagraphs.slice(deponentIndex).forEach((paragraph) => {
    if (typeof paragraph === 'string') {
      addWrapped(paragraph, {
        size: 11,
        gap: 8,
        align: 'justify',
      });

      return;
    }

    // DEPONENT
    if (paragraph.text === 'DEPONENT') {
      // Add signature DIRECTLY ABOVE DEPONENT (right-aligned)
      if (values.signature && values.signature.startsWith('data:image')) {
        try {
          const imgWidth = 40;
          const imgHeight = 15;

          // Position signature on the right side, above DEPONENT
          const xPos = 210 - margin - imgWidth;

          // Detect image type
          const imageType = values.signature.startsWith('data:image/png')
            ? 'PNG'
            : 'JPEG';

          // Add signature image first
          addWrapped('', {
            size: 1,
            gap: 5,
          });

          // Get current Y position
          const currentY = addWrapped('', {
            size: 1,
            gap: 0,
          });

          // Add signature image
          pdf.addImage(
            values.signature,
            imageType,
            xPos,
            currentY,
            imgWidth,
            imgHeight,
          );

          // Move y below the signature
          addWrapped('', {
            size: 1,
            gap: imgHeight + 3,
          });
        } catch (e) {
          console.warn('Could not add signature image:', e);
        }
      }

      // Render DEPONENT text (right-aligned, bold)
      addWrapped(paragraph.text, {
        size: 11,
        gap: 8,
        align: 'right',
        bold: true,
      });

      return;
    }

    // Empty paragraph
    if (paragraph.text === '') {
      addWrapped('', {
        size: 1,
        gap: 15,
      });

      return;
    }

    // Notary sections (SWORN BEFORE A NOTARY PUBLIC, BENIN CITY THIS..., BEFORE ME)
    addWrapped(paragraph.text, {
      size: 11,
      gap: 8,
      align: 'center',
      bold: true,
    });
  });
}

function resolve(text, values) {
  return String(text).replace(/\{\{(\w+)\}\}/g, (_, key) => values[key] ?? '');
}

function slug(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}
