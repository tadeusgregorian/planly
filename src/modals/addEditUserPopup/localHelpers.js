//@flow
import { replaceCommasWithDots, replaceDotsWithCommas } from 'helpers/index'
import _ from 'lodash'

// export const sumWorkHours = (workHours: Array<string | number>): number => {
//   const minutesSum = workHours.reduce((acc, val) => {
//
//     const num = floatToMins(val)
//     return num + acc
//
//   }, 0)
//   //console.log(minutesSum);
//   //console.log(Math.round((minutesSum / 60) * 100) / 100);
//   return Math.round((minutesSum / 60) * 100) / 100
// }

export const isValidFloat = (num: string | number) =>
  !isNaN(parseFloat(replaceCommasWithDots(num.toString())))


export const floatToMins = (inp: string | number): number => {
  if(inp === '') return 0
  const floatNum = parseFloat(replaceCommasWithDots(inp.toString()))
  const minsDec = Math.round(floatNum % 1 * 100) / 100 // round to 2 decimals ( random bug... )
  const hours = floatNum - minsDec
  const mins = Math.round(minsDec * 60)
  const minsTotal = hours * 60 + mins
  return parseFloat(minsTotal)
}

export const minsToFloat = (mins: number): string => {
  return replaceDotsWithCommas(Math.round((mins / 60) * 100) / 100)
}

export const getAverageHours = (inp: string | number, numOfDays: number): number => {
  if(inp === '') return 0
  const floatNum = parseFloat(replaceCommasWithDots(inp.toString()))
  const hoursPerDay = Math.round(floatNum / numOfDays * 100) / 100
  return hoursPerDay
}

export const inpToInt = (inp: string) => inp === '' ? '' : parseInt(inp, 10)

export const extractHours = (minsTotal: number) => Math.floor(minsTotal / 60 ) || 0
export const extractMins  = (minsTotal: number) => minsTotal % 60

export const getAvgs = (workDays: {}, weeklyHours: number | string): {avgHours: number, avgMins: number} => {
  const workDaysCount = _.keys(workDays).length
  const avgDailyMins = floatToMins(weeklyHours) / workDaysCount
  const avgHours = extractHours(avgDailyMins)
  const avgMins = extractMins(avgDailyMins)
  return { avgHours, avgMins}
}
