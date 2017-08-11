//@flow
import moment from 'moment'

export const getRealCurrentSmartWeek = () :number => {
  const calendarWeek = moment().week()
  const year = moment().year()
  return parseInt( '' + year + calendarWeek, 10 )
}

// extracts and returns the year out of the smartWeek
export const getYear = (smartWeek: number) =>
  parseInt(smartWeek.toString().substr(0, 4), 10)

  // extracts and returns the week out of the smartWeek
export const getWeek = (smartWeek: number) =>
  parseInt(smartWeek.toString().substr(4, 2), 10)

export const smartWeekToMoment = (sw: number): moment => {
  return moment().year(getYear(sw)).week(getWeek(sw)).startOf('week')
}

export const momentToSmartWeek = (mom: moment): number => {
  return parseInt(mom.year() + doubleD(mom.week()), 10)
}

export const doubleD = (num: number) =>
  num > 9 ? num.toString() : '0' + num

export const getNextSmartWeek = (sw: number) :number => {
  const newMom = smartWeekToMoment(sw).add(1, 'week')
  return momentToSmartWeek(newMom)
}

export const getPrevSmartWeek = (sw: number) :number => {
  const newMom = smartWeekToMoment(sw).subtract(1, 'week')
  return momentToSmartWeek(newMom)
}
