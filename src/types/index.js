//@flow
import type { RootReducer } from 'reducers/index'

export type Store = RootReducer
export type GetState = ()=> Store

export type Action = {type: string}
export type Dispatch = (action: Action | ThunkAction | Array<Action>) => any // eslint-disable-line no-use-before-define
export type ThunkAction = (any, any, any)=> (dispatch: Dispatch, getState: GetState) => any

// core-types

export type AbsenceType = 'vac' | 'ill' | 'extra'
export type AbsenceStatus = 'requested' | 'accepted'

export type ExcludedDays = {
  mo?: true | null,
  tu?: true | null,
  we?: true | null,
  th?: true | null,
  fr?: true | null,
  sa?: true | null,
  su?: true | null,
}

export type AbsenceBasis = {
  id: string,
  user: string,
  type: AbsenceType,
  year: number,
  status: AbsenceStatus,
  startDate: number,
  endDate: number,
  totalDays: number,
  effective: number,
}

export type Absence = AbsenceBasis & { // this is the absence Obj we get from the DB ( Firebase deleted keys where the value is null or empty obj )
  userNote?: string,
  adminNote?: string,
  excludedDays?: ExcludedDays,
  dayRate?: number, // number of minutes that get counted to the week-sum for an absence-day
  hollow?: true
}

export type AbsenceDB = AbsenceBasis & { // this is the absence Obj we want to write to the DB
  userNote: ?string,
  adminNote: ?string,
  excludedDays: ?ExcludedDays,
  dayRate: ?number, // number of minutes that get counted to the week-sum for an absence-day
  hollow: ?true
}

export type DataStatus =
  'REQUESTED' |
  'NOT_REQUESTED' |
  'LOADED'

export type User = {
  id: string,
  name: string,
  position: string,
  branches: {},
  email: ?string,
  weeklyHours: {},
  status: 'notInvited' | 'invited' | 'active',
  isAdmin?: true,
  isSuperAdmin?: true
}
export type Users = Array<User>

export type Position = {
  id: string,
  name: string,
  color: string
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
  hasEdit?: boolean,
  inCreation?: boolean,
  dimensions?: Dimensions
}

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
  user: string,
  day: Day,
  edit?: MinimalShift,
  note?: ?string,
  isOpen?: ?boolean,
  position?: string,
  location?: ?string
}
export type Shifts = Array<Shift>

export type PreDBShift = {
  id: string,
  s: number,
  e: number,
  b: number,
  day: Day,
  user: string,
  edit?: MinimalShift,
  branch: string,
  note?: ?string,
  position?: ?string,
  isOpen?: ?boolean,
  location?: ?string
}

export type DBShift = {
  branchDay: string,
  userDay: string,
} & PreDBShift

export type ShiftCell = {
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

export type BundeslandCode = 'BE'|'BB'|'HB'|'HH'|'HE'|'MV'|'NI'|'NW'|'RP'|'SL'|'SN'|'ST'|'SH'|'TH'
