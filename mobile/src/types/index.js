//@flow
import type { RootReducer } from 'reducers/index'

export type Store = RootReducer
export type GetState = ()=> Store

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
  weeklyMins: number,
  status: UserStatus,
  isAdmin?: true | null, // can be set to null -> so it gets removed on DB
  isSuperAdmin?: true,
  workDays: WorkDays,
  vacDays?: number,
  avgDailyMins: number,
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

export type MinimalShift = {
  s:  number,
  e:  number,
  b:  number,
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
  userDay: string,
}

export type Shifts = Array<Shift>

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

// AccountDetails
export type BundeslandCode = 'BE'|'BB'|'HB'|'HH'|'HE'|'MV'|'NI'|'NW'|'RP'|'SL'|'SN'|'ST'|'SH'|'TH'

export type AccountPreferences = {
  workdaysPerWeek: number,
  useAvgHoursForVac?: true,
  useAvgHoursForIll?: true,
  bundesland?: BundeslandCode,
}

export type AccountDetails = {
  preferences: AccountPreferences
}

export type DayNote = {
  id: string,
  day: Day,
  color: string,
  note: string,
  branch?: string, // its branch? because this prop gets appended before saving to DB
}

export type AbsenceType = 'vac' | 'ill' | 'extra'

export type WeekAbsence = { // these get created and fanned out in cloud functions -> are all accepted absences
  id: string,
  user: string,
  type: AbsenceType,
  workDays?: WorkDays,
  useAvgHours?: true,
  avgDailyMins: number,
  firstWeekDay: number,
  lastWeekDay: number,
}

export type PlanMode = 'PERSONAL' | 'TEAM'
export type SideNav = 'OPTIONS' | 'BRANCH_PICK'
