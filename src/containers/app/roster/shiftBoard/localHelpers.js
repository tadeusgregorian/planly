//@flow
import type { ShiftCell, Shifts, Notes, ShiftEdits } from 'types/index'

export const isSameCell = (c1: ShiftCell, c2: ShiftCell): boolean => {
  for(const key in c1){
    if(c1.hasOwnProperty(key)){
      if(c1[key] !== c2[key]) return false
    }
  }
  return true
}

export const getShiftsOfUser = (shifts: Shifts, userID: string): Shifts =>
 shifts.filter(s => s.user === userID)

export const getShiftEditsOfUser = (shiftEdits: ShiftEdits, userID: string, smartWeek: number, branch: string): ShiftEdits =>
 shiftEdits.filter(s => s.user === userID && s.smartWeek === smartWeek && s.branch === branch)

export const getNotesOfUser = (notes: Notes, userID: string): Notes =>
 notes.filter(n => n.user === userID)

 export const getShadowedDay = (shadowedCell: ?ShiftCell, userID: string): string | false =>
  !!shadowedCell && shadowedCell.user === userID && shadowedCell.day
