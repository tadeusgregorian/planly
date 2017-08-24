//@flow

export type Action = {type: string}
export type GetState = () => {}
export type Dispatch = (action: Action | ThunkAction | Array<Action>) => any // eslint-disable-line no-use-before-define
export type ThunkAction = (dispatch: Dispatch, getState: GetState) => any

// core-types

export type User = {
  id: string,
  name: string,
  color: string,
  position: string,
  branches: {},
  email: ?string,
  weeklyHours: {},
  status: 'notInvited' | 'invited' | 'active'
}

export type Position = {
  id: string,
  name: string,
  color: string
}

export type Branch = {
  id: string,
  name: string,
  color: string
}

// roster-types
export type Day = 'mo' | 'tu' | 'we' | 'th' | 'fr' | 'sa' | 'su'


export type MinimalShift = {
  s:  number,
  e:  number,
  b?: number | null,
}

export type Shift = {
  s: number,
  e: number,
  b?: number | null,
  user: string,
  day: Day,
  isOpen?: boolean,
  position?: string,
}

export type PreDBShift = {
  s: number,
  e: number,
  b?: number | null,
  day: Day,
  user: string,
  branch: string,
  isOpen?: boolean,
  positioin?: string,
}

export type DBShift = {
  s: number,
  e: number,
  b: number | null,
  day: Day,
  user: string,
  branch: string,
  branchDay: string,
  userDay: string,
  isOpen?: boolean,
  position?: string,
}

export type Shifts = Array<Shift>

export type ShiftCell = {
  day: Day,
  user: string,
  top: number,
  left: number,
  width: number,
  height: number,
  isOpen?: ?boolean
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

export type Notes = Array<Note>
