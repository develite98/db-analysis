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
    value: 'patentCode',
    label: 'Patent Code',
  },
  {
    value: 'patentNo',
    label: 'Patent No',
  },
  {
    value: 'patentName',
    label: 'Patent Name',
  },
  {
    value: 'title',
    label: 'Title',
  },
  {
    value: 'applicantNo',
    label: 'Applicant No',
  },
  {
    value: 'summary',
    label: 'Summary',
  },
];

export const PatentFieldLabelDict: Record<string, string> = PatentFields.reduce(
  (a, b) => {
    a[b.value] = b.label;
    return a;
  },
  {} as Record<string, string>
);
