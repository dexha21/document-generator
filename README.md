# Document Generator - Create React App

This project uses the Create React App structure, not Vite.

## Start from the included project

```bash
npm install
npm start
```

Then open:

http://localhost:3000

## If you want to create a fresh CRA project yourself

```bash
npx create-react-app document-generator
cd document-generator
npm install docx file-saver jspdf
npm start
```

Then replace the generated `src` files with the files in this project.

## Included document templates

- Acceptance Letter
- Guarantor's Letter

## Export

- Word (.docx)
- PDF (.pdf)

## Add another template

Add a new document definition to `src/documents.js`. The same definition powers the form, preview, Word export, and PDF export.
