//@flow

export type Action = {type: string}
export type GetState = () => any
export type Dispatch = (action: Action | ThunkAction | Array<Action>) => any // eslint-disable-line no-use-before-define
export type ThunkAction = (any)=> (dispatch: Dispatch, getState: GetState) => any

// core-types

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
  // $FlowFixMe -> just dont know what is wrong here... Flow doesnt get null stuff
  isOpen?: ?boolean,
  positioin?: string,
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
  position?: string,
} | null

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
