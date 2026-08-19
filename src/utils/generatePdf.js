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
        // Right-aligned container with justified text
        const rightX = 210 - margin;
        const lineWidth =
          (pdf.getStringUnitWidth(line) * size) / pdf.internal.scaleFactor;
        const xPos = rightX - Math.min(lineWidth, maxWidth);
        pdf.text(line, xPos, y, { align: 'left' });
      } else {
        pdf.text(line, margin, y);
      }
      y += gap;
    });

    y += 1;
  };

  // Address - right-aligned container with justified text
  const addressLines = document.renderAddress(values);
  const maxAddressWidth = width * 0.6; // 60% of page width

  addressLines.forEach((line) =>
    addWrapped(line, {
      size: 12,
      gap: 6,
      align: 'right',
      maxWidth: maxAddressWidth,
    }),
  );

  // Date - right-aligned container with justified text
  y += 2;
  addWrapped(document.renderDate(values), {
    size: 12,
    gap: 6,
    align: 'right',
    maxWidth: maxAddressWidth,
  });
  y += 3;

  // Recipient - left aligned (full width)
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

  // Body - justified
  document.renderBody(values).forEach((text) => {
    addWrapped(text, { size: 12, gap: 6 });
    y += 2;
  });

  // Closing
  addWrapped('Thanks.', { size: 12, gap: 6 });
  y += 3;
  addWrapped('Yours faithfully,', { size: 12, gap: 6 });

  // Signature image
  if (values.signature && values.signature.startsWith('data:image')) {
    y += 5;
    try {
      // Calculate dimensions - 40mm width, auto height (preserve aspect ratio)
      const imgWidth = 40;
      const imgHeight = 15;
      pdf.addImage(values.signature, 'JPEG', margin, y, imgWidth, imgHeight);
      y += imgHeight + 2;
    } catch (e) {
      console.warn('Could not add signature image:', e);
      y += 12; // Fallback to space
    }
  } else {
    y += 12; // Space for signature
  }

  addWrapped(resolve(document.signature, values), {
    size: 12,
    bold: true,
    gap: 6,
  });

  pdf.save(`${slug(document.name)}.pdf`);
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
