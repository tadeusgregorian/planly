//@flow
import type { CellRef, Notes, ShiftEdits, OvertimeStatus } from 'types/index'

export const isSameCell = (c1: CellRef, c2: CellRef): boolean => {
  for(const key in c1){
    if(c1.hasOwnProperty(key)){
      if(c1[key] !== c2[key]) return false
    }
  }
  return true
}

export const getOvertimeStatus = (currentWeek: string, startWeek: ?string): OvertimeStatus => {
  if(!startWeek)                return 'NOT_SET'
  if(startWeek === currentWeek) return 'START_WEEK'
  if(currentWeek < startWeek)   return 'BEFORE_START'
  return 'STARTED'
}

export const getShiftEditsOfUser = (shiftEdits: ShiftEdits, userID: string, weekID: string, branch: string): ShiftEdits =>
 shiftEdits.filter(s => s.user === userID && s.weekID === weekID && s.branch === branch)

export const getNotesOfUser = (notes: Notes, userID: string): Notes =>
 notes.filter(n => n.user === userID)

 export const getDay = (shiftCell: ?CellRef, userID: string): string | false =>
  !!shiftCell && shiftCell.user === userID && shiftCell.day
