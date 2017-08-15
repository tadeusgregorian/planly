//@flow

export type Action = {type: string}
export type GetState = () => {}
export type Dispatch = (action: Action | ThunkAction | Array<Action>) => any // eslint-disable-line no-use-before-define
export type ThunkAction = (dispatch: Dispatch, getState: GetState) => any

// core-types

export type userType = {
  id: string,
  name: string,
  color: string,
  position: string,
  branches: {},
  email: string,
  weeklyHours: {},
  status: 'notInvited' | 'invited' | 'active'
}

// roster-types
export type Day = 'mo' | 'tu' | 'we' | 'th' | 'fr' | 'sa' | 'su'


export type MinimalShift = {|
  s: number,
  e: number,
  b?: ?number,
|}

export type Shift = {|
  s: number,
  e: number,
  b?: ?number,
  user: string,
  day: Day
|}

export type PreDBShift = {|
  s: number,
  e: number,
  b?: ?number,
  day: Day,
  user: string,
  branch: string
|}

export type DBShift = {|
  s: number,
  e: number,
  b?: ?number,
  day: Day,
  user: string,
  branch: string,
  branchDay: string,
  userDay: string
|}

export type Shifts = Array<Shift>

export type FocusedCell = {|
  day: string,
  user: string,
  top: number,
  left: number,
  width: number,
  height: number
|}

export type ShiftInput = {|
  startTime: string,
  endTime: string,
  breakMinutes: string
|}
