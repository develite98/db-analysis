import { Field } from './field.model';

export interface Patent {
  patentCode: string;
  patentNo: string;
  patentName: string;
  title: string;
  applicantNo: string;
  inventorName: string;
  summary: string;
  publicationDate: string;
  priorityDate: string;
  filingDate: string;
  ipc: string;
  description: string;
  claims: string;
  countryCode: string;
  author: string;
}

export const PatentFields: Field[] = [
  {
    value: 'PatentCode',
    label: 'Patent Code',
    key: 'patent_code',
  },
  {
    value: 'PatentNo',
    label: 'Patent No',
    key: 'patent_no',
  },
  {
    value: 'PatentName',
    label: 'Patent Name',
    key: 'patent_name',
  },
  {
    value: 'Title',
    label: 'Title',
    key: 'title',
  },
  {
    value: 'ApplicantNo',
    label: 'Applicant No',
    key: 'application_no',
  },
  {
    value: 'Summary',
    label: 'Summary',
    key: 'summary ',
  },
];

export const PatentFieldLabelDict: Record<string, string> = PatentFields.reduce(
  (a, b) => {
    a[b.value] = b.label;
    return a;
  },
  {} as Record<string, string>
);

export const PatentFieldKeyDict: Record<string, string> = PatentFields.reduce(
  (a, b) => {
    a[b.value] = b.key;
    return a;
  },
  {} as Record<string, string>
);
