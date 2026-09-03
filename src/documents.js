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

const affidavitFields = [
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
    name: 'religion',
    label: 'Religion',
    required: true,
    placeholder: 'Christian',
  },
  {
    name: 'nationality',
    label: 'Nationality',
    required: true,
    placeholder: 'Nigeria',
    defaultValue: 'Nigeria',
  },
  {
    name: 'residentialAddress',
    label: 'Residential address',
    required: true,
    placeholder: '10, Owofio Close, Off Jakpa Road, Effurun, Delta State',
  },
  {
    name: 'university',
    label: 'University',
    required: true,
    placeholder: 'University of Benin',
  },
  {
    name: 'stateOfInstitution',
    label: 'State of institution',
    required: true,
    placeholder: 'Edo State',
  },
  {
    name: 'department',
    label: 'Department',
    required: true,
    placeholder: 'Medical Biochemistry',
  },
  {
    name: 'faculty',
    label: 'Faculty',
    required: true,
    placeholder: 'Basic Medical Science',
  },
  {
    name: 'level',
    label: 'Level',
    required: true,
    placeholder: '100L',
  },
  {
    name: 'registrationNumber',
    label: 'Registration number',
    required: true,
    placeholder: '20414831CA',
  },
  {
    name: 'academicSession',
    label: 'Academic session',
    required: true,
    placeholder: '2020/2021',
  },
  {
    name: 'deponentName',
    label: 'Deponent name',
    required: true,
    placeholder: 'UNOKAN FAITH CHIDIEBERE',
  },
  {
    name: 'notaryDay',
    label: 'Notary day',
    required: false,
    placeholder: '15',
  },
  {
    name: 'notaryMonth',
    label: 'Notary month',
    required: false,
    placeholder: 'December',
  },
  {
    name: 'notaryYear',
    label: 'Notary year',
    required: false,
    placeholder: '2021',
  },
  {
    name: 'signature',
    label: 'Signature image',
    type: 'file',
    required: false,
    accept: 'image/*',
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

  affidavitNonMembership: {
    key: 'affidavitNonMembership',
    name: 'Affidavit of Non-Membership of Secret Cult',
    title: 'AFFIDAVIT OF NON-MEMBERSHIP OF SECRET CULT',
    subtitle: 'SWORN BEFORE A NOTARY PUBLIC\nBENIN CITY EDO STATE,\nNIGERIA.',
    fields: affidavitFields,
    recipient: [],
    salutation: '',
    signature: '{{deponentName}}',
    renderAddress: (v) => [],
    renderDate: (v) => '',
    renderBody: (v) => {
      const genderFull =
        v.gender === 'Female' ? 'Female' : v.gender === 'Male' ? 'Male' : '';

      return [
        {
          text: `I, ${v.studentName} (${genderFull}) a ${v.religion} and citizen of the Federal Republic of Nigeria. residing at ${v.residentialAddress}, do hereby make an oath and state as follows:`,
          bold: false,
          align: 'justify',
        },
        {
          text: '1. That I am above named person and deponent herein',
          bold: false,
          align: 'justify',
        },
        {
          text: `2. That I am ${v.level} LEVEL STUDENT of ${v.university}, ${v.stateOfInstitution}, DEPARTMENT of ${v.department}, Registration Number: ${v.registrationNumber}.`,
          bold: false,
          align: 'justify',
        },
        {
          text: '3. That I am aware of the cult renunciation committee of the University.',
          bold: false,
          align: 'justify',
        },
        {
          text: '4. That I have never been a member of any secret cult within and outside the University.',
          bold: false,
          align: 'justify',
        },
        {
          text: '5. That I am not a member or sponsor of any secret cult.',
          bold: false,
          align: 'justify',
        },
        {
          text: '6. That I never aid or abet the activities of any secret cult.',
          bold: false,
          align: 'justify',
        },
        {
          text: '7. That from the rules and regulations of the University, I am aware that membership of any secret cult is incompatible with my status as a student of the University.',
          bold: false,
          align: 'justify',
        },
        {
          text: '8. That the University is at liberty to invoke necessary disciplinary sanction(s) against me for acts unbecoming of a student of the University.',
          bold: false,
          align: 'justify',
        },
        {
          text: '9. That I make this affidavit conscientiously believing same to be true and correct in accordance with the Bendel State Statutory Declaration Law of 1976, now applicable in Edo State of Nigeria.',
          bold: false,
          align: 'justify',
        },
        {
          text: 'DEPONENT',
          bold: true,
          align: 'right',
        },
        {
          text: 'SWORN BEFORE A NOTARY PUBLIC',
          bold: true,
          align: 'center',
        },
        {
          text: `BENIN CITY THIS ${v.notaryDay || '________'} DAY OF ${v.notaryMonth || '________'} ${v.notaryYear || '________'}`,
          bold: true,
          align: 'center',
        },
        {
          text: 'BEFORE ME',
          bold: true,
          align: 'center',
        },
        {
          text: '',
          bold: false,
          align: 'center',
          gap: 10,
        },
      ];
    },
  },

  affidavitGoodConduct: {
    key: 'affidavitGoodConduct',
    name: 'Affidavit of Good Conduct',
    title: 'AFFIDAVIT OF GOOD CONDUCT',
    subtitle: 'SWORN BEFORE A NOTARY PUBLIC\nBENIN CITY EDO STATE,\nNIGERIA.',
    fields: affidavitFields,
    recipient: [],
    salutation: '',
    signature: '{{deponentName}}',
    renderAddress: (v) => [],
    renderDate: (v) => '',
    renderBody: (v) => {
      const genderFull =
        v.gender === 'Female' ? 'Female' : v.gender === 'Male' ? 'Male' : '';

      return [
        {
          text: `I, ${v.studentName} (${genderFull}) a ${v.religion} and citizen of the Federal Republic of Nigeria. residing at ${v.residentialAddress}, do hereby make an oath and state as follows:`,
          bold: false,
          align: 'justify',
        },
        {
          text: `1. That I am a student of ${v.university}, who have been offered provisional admission into Department of ${v.department}, faculty of ${v.faculty} for ${v.academicSession} academic session.`,
          bold: false,
          align: 'justify',
        },
        {
          text: `2. That I hereby undertake to conduct myself in an orderly manner, to be law abiding and of good behaviour avoiding act(s) at variance with ${v.university}. That the University authority shall be at liberty to take any necessary administrative disciplinary action(s) as deemed proper against me in the event of my default.`,
          bold: false,
          align: 'justify',
        },
        {
          text: '3. And that I make this solemn declaration conscientiously believing same to be true and correct in accordance with defunct Bendel State Statutory Declaration in Edo State of Nigeria.',
          bold: false,
          align: 'justify',
        },
        {
          text: 'DEPONENT',
          bold: true,
          align: 'right',
        },
        {
          text: 'SWORN BEFORE A NOTARY PUBLIC',
          bold: true,
          align: 'center',
        },
        {
          text: `BENIN CITY THIS ${v.notaryDay || '________'} DAY OF ${v.notaryMonth || '________'} ${v.notaryYear || '________'}`,
          bold: true,
          align: 'center',
        },
        {
          text: 'BEFORE ME',
          bold: true,
          align: 'center',
        },
        {
          text: '',
          bold: false,
          align: 'center',
          gap: 10,
        },
      ];
    },
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
