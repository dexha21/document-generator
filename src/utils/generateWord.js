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

  // Check if it's an affidavit document
  if (
    document.key === 'affidavitNonMembership' ||
    document.key === 'affidavitGoodConduct'
  ) {
    // Title - centered, bold
    paragraphs.push(
      new Paragraph({
        children: [new TextRun(document.title, { bold: true })],
        alignment: AlignmentType.CENTER,
        spacing: { after: convertInchesToTwip(0.2) },
      }),
    );

    // Subtitle - centered, bold
    if (document.subtitle) {
      const subtitleLines = document.subtitle.split('\n');
      subtitleLines.forEach((line) => {
        paragraphs.push(
          new Paragraph({
            children: [new TextRun(line, { bold: true })],
            alignment: AlignmentType.CENTER,
            spacing: { after: convertInchesToTwip(0.1) },
          }),
        );
      });
    }

    // Add spacing after subtitle
    paragraphs.push(
      new Paragraph({
        spacing: { after: convertInchesToTwip(0.3) },
      }),
    );

    // Body paragraphs
    const bodyParagraphs = document.renderBody(values);

    // Find the DEPONENT index
    const deponentIndex = bodyParagraphs.findIndex(
      (p) => typeof p === 'object' && p.text === 'DEPONENT',
    );

    // Render all paragraphs BEFORE DEPONENT
    bodyParagraphs.slice(0, deponentIndex).forEach((paragraph) => {
      if (typeof paragraph === 'string') {
        paragraphs.push(
          new Paragraph({
            children: [new TextRun(paragraph)],
            alignment: AlignmentType.JUSTIFIED,
            spacing: {
              after: convertInchesToTwip(0.18),
              line: 276,
            },
          }),
        );
      } else {
        paragraphs.push(
          new Paragraph({
            children: [
              new TextRun(paragraph.text, { bold: paragraph.bold || false }),
            ],
            alignment: AlignmentType.JUSTIFIED,
            spacing: {
              after: convertInchesToTwip(0.18),
              line: 276,
            },
          }),
        );
      }
    });

    // Add signature image BEFORE DEPONENT (right-aligned)
    if (values.signature && values.signature.startsWith('data:image')) {
      try {
        const base64Data = values.signature.split(',')[1];
        const imageBuffer = Buffer.from(base64Data, 'base64');

        let imageType = 'png';
        if (
          values.signature.startsWith('data:image/jpeg') ||
          values.signature.startsWith('data:image/jpg')
        ) {
          imageType = 'jpeg';
        } else if (values.signature.startsWith('data:image/png')) {
          imageType = 'png';
        }

        const imageRun = new ImageRun({
          data: imageBuffer,
          transformation: {
            width: 120,
            height: 60,
          },
          type: imageType,
        });

        paragraphs.push(
          new Paragraph({
            children: [imageRun],
            alignment: AlignmentType.RIGHT,
            spacing: { after: convertInchesToTwip(0.1) },
          }),
        );
      } catch (e) {
        console.warn('Could not add signature image:', e);
      }
    }

    // Render DEPONENT and everything AFTER
    bodyParagraphs.slice(deponentIndex).forEach((paragraph) => {
      if (typeof paragraph === 'string') {
        paragraphs.push(
          new Paragraph({
            children: [new TextRun(paragraph)],
            alignment: AlignmentType.JUSTIFIED,
            spacing: {
              after: convertInchesToTwip(0.18),
              line: 276,
            },
          }),
        );
      } else {
        const alignmentMap = {
          center: AlignmentType.CENTER,
          right: AlignmentType.RIGHT,
          left: AlignmentType.LEFT,
          justify: AlignmentType.JUSTIFIED,
        };

        paragraphs.push(
          new Paragraph({
            children: [
              new TextRun(paragraph.text, { bold: paragraph.bold || false }),
            ],
            alignment: alignmentMap[paragraph.align] || AlignmentType.JUSTIFIED,
            spacing: {
              after: convertInchesToTwip(0.18),
              line: 276,
            },
          }),
        );
      }
    });
  } else {
    // Regular document generation (existing code)
    document.renderAddress(values).forEach((line) => {
      paragraphs.push(
        new Paragraph({
          children: [new TextRun(line)],
          alignment: AlignmentType.RIGHT,
          spacing: { after: 0 },
        }),
      );
    });

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

    document.recipient.forEach((line) => {
      paragraphs.push(
        new Paragraph({
          children: [new TextRun(resolve(line, values))],
          alignment: AlignmentType.LEFT,
          spacing: { after: 0 },
        }),
      );
    });

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

    paragraphs.push(
      new Paragraph({
        children: [new TextRun(document.title, { bold: true })],
        alignment: AlignmentType.CENTER,
        spacing: { after: convertInchesToTwip(0.25) },
      }),
    );

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

    paragraphs.push(
      new Paragraph({
        children: [new TextRun('Thanks.')],
        spacing: {
          before: convertInchesToTwip(0.08),
          after: convertInchesToTwip(0.22),
        },
      }),
    );

    paragraphs.push(
      new Paragraph({
        children: [new TextRun('Yours faithfully,')],
        spacing: { after: convertInchesToTwip(0.55) },
      }),
    );

    if (values.signature && values.signature.startsWith('data:image')) {
      try {
        const base64Data = values.signature.split(',')[1];
        const imageBuffer = Buffer.from(base64Data, 'base64');

        let imageType = 'png';
        if (
          values.signature.startsWith('data:image/jpeg') ||
          values.signature.startsWith('data:image/jpg')
        ) {
          imageType = 'jpeg';
        } else if (values.signature.startsWith('data:image/png')) {
          imageType = 'png';
        }

        const imageRun = new ImageRun({
          data: imageBuffer,
          transformation: {
            width: 120,
            height: 60,
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
        console.warn('Could not add signature image:', e);
      }
    }

    paragraphs.push(
      new Paragraph({
        children: [
          new TextRun(resolve(document.signature, values), { bold: true }),
        ],
        alignment: AlignmentType.LEFT,
      }),
    );
  }

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
