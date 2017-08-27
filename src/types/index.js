//@flow
import type { RootReducer } from 'reducers/index'

export type Action = {type: string}
export type GetState = () => any
export type Dispatch = (action: Action | ThunkAction | Array<Action>) => any // eslint-disable-line no-use-before-define
export type ThunkAction = (any, any, any)=> (dispatch: Dispatch, getState: GetState) => any

// core-types

export type State = RootReducer

export type DataStatus =
  'REQUESTED' |
  'NOT_REQUESTED' |
  'LOADED'

export type User = {
  id: string,
  name: string,
  color: string,
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

export type Branch = {
  id: string,
  name: string,
  color: string
}
export type Branches = Array<Branch>

// roster-types
export type Day = 'mo' | 'tu' | 'we' | 'th' | 'fr' | 'sa' | 'su'


export type MinimalShift = {
  s:  number,
  e:  number,
  b: number,
}

export type Shift = {
  s: number,
  e: number,
  b: number,
  user: string,
  day: Day,
  isOpen?: ?boolean,
  position?: string,
}

export type Shifts = Array<Shift>

export type PreDBShift = {
  s: number,
  e: number,
  b: number,
  day: Day,
  user: string,
  branch: string,
  position?: string,
  // $FlowFixMe
  isOpen?: ?boolean
}

export type DBShift = {
  s: number,
  e: number,
  b: number,
  day: Day,
  user: string,
  branch: string,
  branchDay: string,
  userDay: string,
  isOpen: true | null,
  position: string | null,
}

export type ShiftCell = {
  day: Day,
  user: string,
  top: number,
  left: number,
  width: number,
  height: number,
  isOpen?: ?boolean,
  blocked?: ?boolean,
  hasShift?: true,
  hasEdit?: true
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
  smartWeek: string,
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
  smartWeek: string,
  branch: string
}

export type ShiftEdits = Array<ShiftEdit>

export type DBShiftEdit = ShiftEdit & {
  branchDay: string,
  userDay: string
}
