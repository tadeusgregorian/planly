//@flow
import moment from 'moment'

export const getRangeArray = (first: number, last: number) => {
  const arr = []
  for( let i = first; i <= last; i++){ arr.push(i) }
  return arr
}

export const takeYear = (smartWeek: number): number => {
  return parseInt(smartWeek.toString().substr(0, 4), 10)
}

export const takeWeek = (smartWeek: number): number => {
  return parseInt(smartWeek.toString().substr(4, 2), 10)
}

export const getWeeksInYear = (y: number) => moment().year(y).weeksInYear()
