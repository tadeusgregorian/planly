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

export type shiftType = {
  s: number,
  e: number,
  b?: number,
}

export type shiftDaysType = {|
  mo?: shiftType,
  tu?: shiftType,
  we?: shiftType,
  th?: shiftType,
  fr?: shiftType,
  sa?: shiftType,
  su?: shiftType
|}

export type shiftsType = {
  [string]: shiftDaysType
}

export type focusedCellType = {
  day: string,
  user: string,
  top: number,
  left: number,
  width: number,
  height: number
}
