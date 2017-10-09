//@flow
import type { AbsenceType } from 'types/index'

export const setCurrentBranch = (branchID: string) =>
  ({ type: 'ABSENCE_SET_CURRENT_BRANCH', payload: branchID })

export const setCurrentYear = (year: number) =>
  ({ type: 'ABSENCE_SET_CURRENT_YEAR', payload: year })

export const setCurrentMonth = (month: number) =>
  ({ type: 'ABSENCE_SET_CURRENT_MONTH', payload: month })

export const setCurrentType = (type: AbsenceType | 'all') =>
  ({ type: 'ABSENCE_SET_CURRENT_TYPE', payload: type })
