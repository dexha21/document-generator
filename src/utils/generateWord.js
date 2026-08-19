import { Buffer } from 'buffer';
import {
  AlignmentType,
  convertInchesToTwip,
  Document,
  ImageRun,
  Packer,
  Paragraph,
  TextRun,
} from 'docx';
import { saveAs } from 'file-saver';

export async function downloadWord(document, values) {
  const paragraphs = [];

  // Address - right-aligned container with justified text
  document.renderAddress(values).forEach((line) => {
    paragraphs.push(
      new Paragraph({
        children: [new TextRun(line)],
        alignment: AlignmentType.RIGHT,
        spacing: { after: 0 },
      }),
    );
  });

  // Date - right-aligned container with justified text
  paragraphs.push(
    new Paragraph({
      children: [new TextRun(document.renderDate(values))],
      alignment: AlignmentType.RIGHT,
      spacing: {
        before: convertInchesToTwip(0.18),
        after: convertInchesToTwip(0.25),
      },
    }),
  );

  // Recipient - left aligned
  document.recipient.forEach((line) => {
    paragraphs.push(
      new Paragraph({
        children: [new TextRun(resolve(line, values))],
        alignment: AlignmentType.LEFT,
        spacing: { after: 0 },
      }),
    );
  });

  // Salutation - left aligned
  paragraphs.push(
    new Paragraph({
      children: [new TextRun(resolve(document.salutation, values))],
      alignment: AlignmentType.LEFT,
      spacing: {
        before: convertInchesToTwip(0.18),
        after: convertInchesToTwip(0.25),
      },
    }),
  );

  // Title - centered
  paragraphs.push(
    new Paragraph({
      children: [new TextRun(document.title, { bold: true })],
      alignment: AlignmentType.CENTER,
      spacing: { after: convertInchesToTwip(0.25) },
    }),
  );

  // Body - justified
  document.renderBody(values).forEach((text) => {
    paragraphs.push(
      new Paragraph({
        children: [new TextRun(text)],
        alignment: AlignmentType.JUSTIFIED,
        spacing: {
          after: convertInchesToTwip(0.18),
          line: 276,
        },
      }),
    );
  });

  // Thanks
  paragraphs.push(
    new Paragraph({
      children: [new TextRun('Thanks.')],
      spacing: {
        before: convertInchesToTwip(0.08),
        after: convertInchesToTwip(0.22),
      },
    }),
  );

  // Yours faithfully
  paragraphs.push(
    new Paragraph({
      children: [new TextRun('Yours faithfully,')],
      spacing: { after: convertInchesToTwip(0.55) },
    }),
  );

  // Signature image
  if (values.signature && values.signature.startsWith('data:image')) {
    try {
      // Extract the base64 data from the data URL
      const base64Data = values.signature.split(',')[1];
      const imageBuffer = Buffer.from(base64Data, 'base64');

      // Detect image format
      let imageType = 'png';
      if (
        values.signature.startsWith('data:image/jpeg') ||
        values.signature.startsWith('data:image/jpg')
      ) {
        imageType = 'jpeg';
      } else if (values.signature.startsWith('data:image/png')) {
        imageType = 'png';
      } else if (values.signature.startsWith('data:image/gif')) {
        imageType = 'gif';
      }

      // Create image run
      const imageRun = new ImageRun({
        data: imageBuffer,
        transformation: {
          width: 120, // in twips (120 twips = ~2.12mm, adjust as needed)
          height: 60, // in twips
        },
        type: imageType,
      });

      paragraphs.push(
        new Paragraph({
          children: [imageRun],
          alignment: AlignmentType.LEFT,
          spacing: { after: convertInchesToTwip(0.2) },
        }),
      );
    } catch (e) {
      console.warn('Could not add signature image to Word document:', e);
      // Fallback to space
      paragraphs.push(
        new Paragraph({
          spacing: { after: convertInchesToTwip(0.55) },
        }),
      );
    }
  } else {
    // Space for signature if no image
    paragraphs.push(
      new Paragraph({
        spacing: { after: convertInchesToTwip(0.55) },
      }),
    );
  }

  // Signature text (name)
  paragraphs.push(
    new Paragraph({
      children: [
        new TextRun(resolve(document.signature, values), { bold: true }),
      ],
      alignment: AlignmentType.LEFT,
    }),
  );

  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: convertInchesToTwip(0.75),
              right: convertInchesToTwip(0.9),
              bottom: convertInchesToTwip(0.75),
              left: convertInchesToTwip(0.9),
            },
          },
        },
        children: paragraphs,
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, `${slug(document.name)}.docx`);
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
