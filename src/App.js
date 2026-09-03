import { useMemo, useState } from 'react';
import './App.css';
import { DOCUMENTS } from './documents';
import { downloadPdf } from './utils/generatePdf';
import { downloadWord } from './utils/generateWord';

const allFields = Object.values(DOCUMENTS).flatMap((d) => d.fields);
const initialValues = Object.fromEntries(
  allFields.map((field) => [field.name, field.defaultValue ?? '']),
);

initialValues.signature = '';

function App() {
  const [documentKey, setDocumentKey] = useState('acceptance');
  const [values, setValues] = useState(initialValues);

  const document = DOCUMENTS[documentKey];

  const handleFileUpload = (name, file) => {
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      setValues((current) => ({ ...current, [name]: e.target.result }));
    };
    reader.readAsDataURL(file);
  };

  const updateValue = (name, value) => {
    setValues((current) => ({ ...current, [name]: value }));
  };

  const resetDocument = () => {
    setValues((current) => {
      const next = { ...current };
      document.fields.forEach((field) => {
        next[field.name] = field.defaultValue ?? '';
      });
      return next;
    });
  };

  const canGenerate = useMemo(
    () =>
      document.fields
        .filter((field) => field.required)
        .every((field) => String(values[field.name] ?? '').trim()),
    [document, values],
  );

  const generate = async (type) => {
    if (!canGenerate) {
      window.alert('Please fill all required fields first.');
      return;
    }

    if (type === 'word') {
      await downloadWord(document, values);
    } else {
      downloadPdf(document, values);
    }
  };

  return (
    <div className="app">
      <header className="topbar">
        <div>
          <h1>Document Generator</h1>
        </div>
      </header>

      <main className="layout">
        <section className="panel form-panel">
          <div className="section-title">
            <div>
              <h2>Document details</h2>
              <p>Select a document and enter the information.</p>
            </div>
            <button className="secondary" onClick={resetDocument}>
              Reset
            </button>
          </div>

          <label className="field">
            <span>Document type</span>
            <select
              value={documentKey}
              onChange={(event) => setDocumentKey(event.target.value)}
            >
              {Object.values(DOCUMENTS).map((item) => (
                <option key={item.key} value={item.key}>
                  {item.name}
                </option>
              ))}
            </select>
          </label>

          <div className="fields">
            {document.fields.map((field) => (
              <label className="field" key={field.name}>
                <span>
                  {field.label}
                  {field.required ? ' *' : ''}
                </span>

                {field.type === 'textarea' ? (
                  <textarea
                    rows="3"
                    value={values[field.name] ?? ''}
                    placeholder={field.placeholder ?? ''}
                    onChange={(event) =>
                      updateValue(field.name, event.target.value)
                    }
                  />
                ) : field.type === 'select' ? (
                  <select
                    value={values[field.name] ?? ''}
                    onChange={(event) =>
                      updateValue(field.name, event.target.value)
                    }
                  >
                    <option value="">Select...</option>
                    {field.options.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                ) : field.type === 'file' ? (
                  <div className="file-upload">
                    <input
                      type="file"
                      accept={field.accept ?? 'image/*'}
                      onChange={(event) =>
                        handleFileUpload(field.name, event.target.files?.[0])
                      }
                    />
                    {values[field.name] && (
                      <div className="signature-preview">
                        <img src={values[field.name]} alt="Signature preview" />
                        <button
                          type="button"
                          className="remove-file"
                          onClick={() => updateValue(field.name, '')}
                        >
                          Remove
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <input
                    type={field.type ?? 'text'}
                    value={values[field.name] ?? ''}
                    placeholder={field.placeholder ?? ''}
                    onChange={(event) =>
                      updateValue(field.name, event.target.value)
                    }
                  />
                )}
              </label>
            ))}
          </div>

          <div className="actions">
            <button className="primary" onClick={() => generate('word')}>
              Download Word
            </button>
            <button className="dark" onClick={() => generate('pdf')}>
              Download PDF
            </button>
          </div>
        </section>

        <section className="panel preview-panel">
          <div className="preview-header">
            <div>
              <h2>Live preview</h2>
              <p>Preview updates as you type.</p>
            </div>
          </div>

          <DocumentPreview document={document} values={values} />
        </section>
      </main>
    </div>
  );
}

function DocumentPreview({ document, values }) {
  if (
    document.key === 'affidavitNonMembership' ||
    document.key === 'affidavitGoodConduct'
  ) {
    return <AffidavitPreview document={document} values={values} />;
  }

  return (
    <div className="paper">
      <div className="paper-address-right">
        {document.renderAddress(values).map((line, index) => (
          <div key={index}>{line}</div>
        ))}
      </div>

      <div className="paper-date-right">
        <div>{document.renderDate(values)}</div>
      </div>

      <div className="paper-recipient">
        {document.recipient.map((line, index) => (
          <div key={index}>{resolve(line, values)}</div>
        ))}
      </div>

      <div className="paper-salutation">
        {resolve(document.salutation, values)}
      </div>

      <h3 className="paper-title">{document.title}</h3>

      <div className="paper-body">
        {document.renderBody(values).map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </div>

      <div className="paper-closing">
        <p>Thanks.</p>
        <p>Yours faithfully,</p>

        {values.signature ? (
          <div className="signature-image">
            <img src={values.signature} alt="Signature" />
          </div>
        ) : (
          <div className="signature-space" />
        )}

        <strong>{resolve(document.signature, values)}</strong>
      </div>
    </div>
  );
}

function AffidavitPreview({ document, values }) {
  const paragraphs = document.renderBody(values);

  return (
    <div className="paper affidavit-paper">
      <div className="affidavit-header">
        <h3 className="paper-title">
          {document.subtitle.split('\n').map((line, index) => (
            <div key={index}>{line}</div>
          ))}
        </h3>
        <div className="affidavit-subtitle">{document.title}</div>
      </div>

      <div className="affidavit-body">
        {paragraphs.map((paragraph, index) => {
          if (typeof paragraph === 'string') {
            return <p key={index}>{paragraph}</p>;
          }

          const paragraphStyle = {
            textAlign: paragraph.align || 'justify',
            fontWeight: paragraph.bold ? 'bold' : 'normal',
          };

          // Add signature image before DEPONENT
          if (paragraph.text === 'DEPONENT' && values.signature) {
            return (
              <div
                key={index}
                style={{ display: 'flex', flexDirection: 'row-reverse' }}
              >
                <div style={{ minWidth: '150px', width: 'fit-content' }}>
                  <div
                    className="signature-image"
                    style={{ textAlign: 'center', margin: '0px auto' }}
                  >
                    <img
                      src={values.signature}
                      alt="Signature"
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'contain',
                      }}
                    />
                  </div>
                  <p
                    style={{
                      textAlign: 'center',
                      fontWeight: 'bold',
                      borderTop: '1px solid #000',
                    }}
                  >
                    {paragraph.text}
                  </p>
                </div>
              </div>
            );
          }

          return (
            <p key={index} style={paragraphStyle}>
              {paragraph.text}
            </p>
          );
        })}
      </div>
    </div>
  );
}

function resolve(text, values) {
  return String(text).replace(/\{\{(\w+)\}\}/g, (_, key) => values[key] ?? '');
}

export default App;
