const addressFields = [
  {
    name: 'addressLine1',
    label: 'Address line 1',
    required: true,
    placeholder: '10, Owofio Close',
  },
  {
    name: 'addressLine2',
    label: 'Address line 2',
    required: false,
    placeholder: 'Off Jakpa Road',
  },
  {
    name: 'town',
    label: 'Town / City',
    required: true,
    placeholder: 'Effurun',
  },
  {
    name: 'state',
    label: 'State',
    required: true,
    placeholder: 'Delta State',
  },
  {
    name: 'country',
    label: 'Country',
    required: true,
    placeholder: 'Nigeria',
    defaultValue: 'Nigeria',
  },
  {
    name: 'date',
    label: 'Date',
    type: 'date',
    required: true,
  },
];

const commonStudentFields = [
  {
    name: 'studentName',
    label: 'Student full name',
    required: true,
    placeholder: 'UNOKAN FAITH CHIDIEBERE',
  },
  {
    name: 'gender',
    label: 'Gender',
    type: 'select',
    required: true,
    options: ['Female', 'Male'],
  },
  {
    name: 'university',
    label: 'University',
    required: true,
    placeholder: 'University of Benin',
  },
  {
    name: 'city',
    label: 'University city',
    required: true,
    placeholder: 'Benin City',
  },
  {
    name: 'stateOfInstitution',
    label: 'State of institution',
    required: true,
    placeholder: 'Edo state',
  },
];

export const DOCUMENTS = {
  acceptance: {
    key: 'acceptance',
    name: 'Acceptance Letter',
    title: 'ACCEPTANCE LETTER',
    fields: [
      ...addressFields,
      ...commonStudentFields,
      {
        name: 'course',
        label: 'Course',
        required: true,
        placeholder: 'MEDICAL BIOCHEMISTRY',
      },
      {
        name: 'faculty',
        label: 'Faculty',
        required: true,
        placeholder: 'BASIC MEDICAL SCIENCE',
      },
      {
        name: 'signature',
        label: 'Signature image',
        type: 'file',
        required: false,
        accept: 'image/*',
      },
    ],
    recipient: ['The Registrar,', '{{university}},', '{{city}},'],
    salutation: 'Dear Sir/Ma,',
    signature: '{{studentName}}',
    renderAddress: (v) =>
      [
        v.addressLine1,
        v.addressLine2,
        v.town + ',',
        v.state + ',',
        v.country + '.',
      ].filter(Boolean),
    renderDate: (v) => formatDate(v.date),
    renderBody: (v) => [
      `I, ${v.studentName} (${genderInitial(v.gender)}) have accepted the admission given to me, by the ${v.university}, to study ${v.course}, faculty of ${v.faculty}.`,
      `I promise to obey all the rules and regulations guiding the institution throughout my stay in this noble university.`,
      `Thanks for your offer and future anticipated co-operation.`,
    ],
  },

  guarantor: {
    key: 'guarantor',
    name: "Guarantor's Letter",
    title: 'GUARANTOR’S LETTER',
    fields: [
      ...addressFields,
      ...commonStudentFields,
      {
        name: 'relationship',
        label: 'Relationship to student',
        required: true,
        placeholder: 'daughter',
      },
      {
        name: 'guarantorName',
        label: 'Guarantor full name',
        required: true,
        placeholder: 'NGOZI IGBOKWE',
      },
      {
        name: 'signature',
        label: 'Signature image',
        type: 'file',
        required: false,
        accept: 'image/*',
      },
    ],
    recipient: ['The Registrar,', '{{university}},', '{{city}},'],
    salutation: 'Dear Registrar,',
    signature: '{{guarantorName}}',
    renderAddress: (v) =>
      [
        v.addressLine1,
        v.addressLine2,
        v.town + ',',
        v.state + ',',
        v.country + '.',
      ].filter(Boolean),
    renderDate: (v) => formatDate(v.date),
    renderBody: (v) => [
      `This is to certify that ${v.studentName} (${genderInitial(v.gender)}) who has just gained admission into your institution, ${v.university}, ${v.city}, ${v.stateOfInstitution}, is my ${v.relationship}.`,
      `I hereby write to guarantee that ${pronoun(v.gender)} will be of good behavior throughout the period of ${possessive(v.gender)} studies in the institution, and I will be responsible for ${possessive(v.gender)} financial requirements.`,
      `Thanks.`,
    ],
  },
};

function genderInitial(gender) {
  return gender === 'Female' ? 'F' : gender === 'Male' ? 'M' : '';
}

function pronoun(gender) {
  return gender === 'Female' ? 'she' : gender === 'Male' ? 'he' : 'they';
}

function possessive(gender) {
  return gender === 'Female' ? 'her' : gender === 'Male' ? 'his' : 'their';
}

function formatDate(value) {
  if (!value) return '';

  const date = new Date(value + 'T00:00:00');

  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}
