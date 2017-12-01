//@flow
import type { RootReducer } from 'reducers/index'

export type Store = RootReducer
export type GetState = () => Store

export type Action = {type: string}
export type Dispatch = (action: Action | ThunkAction | Array<Action>) => any // eslint-disable-line no-use-before-define
export type ThunkAction = (any, any, any)=> (dispatch: Dispatch, getState: GetState) => any

// core-types

export type WorkDays = {
  mo?: number | null,
  tu?: number | null,
  we?: number | null,
  th?: number | null,
  fr?: number | null,
  sa?: number | null,
  su?: number | null,
}

export type AbsenceType = 'vac' | 'ill' | 'extra'
export type AbsenceTypeFilter = 'vac' | 'ill' | 'extra' | 'all'
export type AbsenceStatus = 'requested' | 'accepted'

export type Absence = { // this is the absence Obj we get from the DB ( Firebase deleted keys where the value is null or empty obj )
  id: string,//
  user: string, //
  type: AbsenceType,//
  status: AbsenceStatus,//
  year: number,
  startDate: number,//
  endDate: number,//
  effectiveDays: number,//
  note?: ?string, //
  user_startDate: string,
}

export type AbsenceCorrection = {
  id: string,
  user: string,
  year: number,
  extraDays?: number | null,
  vacDaysTransfered?: number | null,
  vacDaysCorrected?: number | null,
  vacDays?: number | null,
}

export type DataStatus =
  'REQUESTED' |
  'NOT_REQUESTED' |
  'LOADED'

export type UserStatus = 'NOT_INVITED' | 'INVITED' | 'ACTIVE'

export type InitialOvertime = {
  smartWeek: number,
  hours: number
}

export type User = {
  id: string,
  name: string,
  position: string,
  branches: {},
  email: ?string,
  weeklyMins: { [ weekID: string]: number },
  status: UserStatus,
  isAdmin?: true | null, // can be set to null -> so it gets removed on DB
  isSuperAdmin?: true,
  deleted?: true | null, // can be set to null -> so it gets removed on DB
}

export type Users = Array<User>

export type Position = {
  id: string,
  name: string,
  color: string,
  nr: number, // a Intiger used for sorting
  shortcut: string,
}
export type Positions = Array<Position>

export type Location = {
  id: string,
  name: string,
  color: string,
  deleted?: true
}

export type Branch = {
  id: string,
  name: string,
  locations?: {[string]: ?Location}
}

export type Branches = Array<Branch>

// roster-types
export type Day = 'mo' | 'tu' | 'we' | 'th' | 'fr' | 'sa' | 'su'

type Dimensions = {
  top: number,
  left: number,
  width: number,
  height: number
}

export type ShiftRef = {
  id: string,
  day: Day,
  user: string,
  position?: ?string,
  hasEdit?: ?boolean,
  inCreation?: ?boolean,
  dimensions?: ?Dimensions
}

export type MinimalShift = {
  s:  number,
  e:  number,
  b:  number,
}

export type PreShift = {
  id: string,
  s: number,
  e: number,
  b: number,
  day: Day,
  user: string,
  edit?: ?MinimalShift,
  note?: ?string,
  position?: ?string,
  location?: ?string
}

export type Shift = {
  id: string,
  s: number,
  e: number,
  b: number,
  day: Day,
  user: string,
  edit?: ?MinimalShift,
  branch: string,
  note?: ?string,
  position?: ?string,
  location?: ?string,
  branchDay: string,
}

export type Shifts = Array<Shift>

export type MiniShift = {
  id: string,
  branch: string,
  day: Day,
  mins: number,
  user: string
}

export type CellRef = {
  day: Day,
  user: string,
  hasShift?: true,
}

export type ShiftInput = {
  startTime: string,
  endTime: string,
  breakMinutes: string
}

export type Note = {
  id:         string,
  user?:      string,
  day:        string,
  type:       string,
  timeStamp:  number,
  branch:     string,
  author:     string,
  text:       string
}

export type PreDBNote = {
  weekID: string,
  branch: string,
  author: string,
  text: string,
  type: string,
  user?: string,
  day: string
}

export type Notes = Array<Note>

export type ShiftEdit = {
  s: number,
  e: number,
  b: number,
  user: string,
  day: Day,
  weekID: number,
  branch: string
}

export type ShiftEdits = Array<ShiftEdit>

export type DBShiftEdit = ShiftEdit & {
  branchDay: string,
  userDay: string
}

export type TemplateFlat = {
  id: string,
  name: string,
  branch: string
}

export type TemplatesFlat = Array<TemplateFlat>

// AccountDetails
export type BundeslandCode = 'BE'|'BB'|'HB'|'HH'|'HE'|'MV'|'NI'|'NW'|'RP'|'SL'|'SN'|'ST'|'SH'|'TH'

export type AccountPreferences = {
  excludingSunndays: boolean,
  excludingSaturdays: boolean,
  bundesland: BundeslandCode,
}

export type AccountDetails = {
  preferences: AccountPreferences
}

export type Correction = {
  user: string,
  week: string,
  mins: number,
  initial?: true | null,
  note?: string | null,
}

export type ExtraHours = {
  id: string,
  day: Day,
  user: string,
  note?: ?string,
  mins: number,
}

export type ExtraHoursDB = ExtraHours & {
  branch: string,
  branchDay: string,
}

export type DayNote = {
  id: string,
  day: Day,
  color: string,
  note: string,
  branch?: string, // its branch? because this prop gets appended before saving to DB
}

export type OvertimeStatus = 'NOT_SET' | 'START_WEEK' | 'STARTED' | 'BEFORE_START'

// ExtraStuff

export type PlanMode = 'PERSONAL' | 'TEAM'
export type SideNav = 'OPTIONS' | 'BRANCH_PICK'
