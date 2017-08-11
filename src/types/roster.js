//@flow

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
