type DailyNote = {
  id?: number;
  date: string;
  attributes: DailyNoteAttribute[];
};

type DailyNoteAttribute = { name: string; value: string };

type NoteAttribute = {
  id: number;
  name: string;
  element: NoteAttributeElement;
};

type NoteConfiguration = {
  id: number;
  noteAttributes: NoteAttribute[];
};

const NoteAttributeElements = <const>[
  'scale10',
  'textfield',
  'numberinput',
  'textarea',
  'checkbox',
];
type NoteAttributeElement = (typeof NoteAttributeElements)[number];

const SettingsCategories = <const>['general', 'noteAttributes', 'noteConfig'];
type SettingsCategory = (typeof SettingsCategories)[number];

type ColorCodeConfiguration = {
  logicGate: LogicGate;
  clauses: FilterClause[];
  colorHex: string;
}[];

type DiaryFilterConfiguration = {
  logicGate: LogicGate;
  clauses: FilterClause[];
};

type FilterClause = {
  element: string;
  operator: FilterOperators;
  value: string;
};

type FilterOperators =
  | ''
  | 'is empty'
  | '='
  | '>'
  | '<'
  | '>='
  | '<='
  | 'contains';

type LogicGate = 'AND' | 'OR' | 'XOR';

type Notebook = {
  id: number;
  pages: Page[];
  title: string;
  isShared: boolean;
};

type Page = {
  content: string;
  id: number;
  notebookId: number;
  parentId: number | null;
  subpages: Page[];
  title: string;
};

type UserData = {
  id: string;
  username: string;
  fullName: string;
  profilePicture: string;
  roles: string[];
};

type AccessToken = {
  id: number;
  name: string;
  userId: string;
  roles: string[];
  createdAt: string;
};

type APIIdentityError = {
  code: string;
  description: string;
}[];

type APIErrorResponse = {
  code: string;
  description: string;
};

type Medication = {
  id: number;
  name: string;
  description: string;
  strength: string;
  type: string;
};

type MedicationPlanEntry = {
  id: number;
  startDate: string;
  endDate?: string;
  dosage: string;
  medication: Medication;
  isAsNeeded: boolean;
  schedule?: {
    id: number;
    type: string;
    timesOfDay: string[];
    daysOfWeek?: string[];
    intervalDays?: number;
    intervalWeeks?: number;
  };
  isActive: boolean;
  notes?: string;
  stoppedReason?: string;
};

export type {
  DailyNote,
  NoteAttribute,
  NoteAttributeElement,
  DailyNoteAttribute,
  NoteConfiguration,
  SettingsCategory,
  ColorCodeConfiguration,
  DiaryFilterConfiguration,
  FilterOperators,
  LogicGate,
  Notebook,
  Page,
  UserData,
  AccessToken,
  APIErrorResponse,
  APIIdentityError,
  Medication,
  MedicationPlanEntry,
};
export { NoteAttributeElements, SettingsCategories };
