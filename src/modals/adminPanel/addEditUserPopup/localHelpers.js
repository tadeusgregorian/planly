//@flow
import { replaceCommasWithDots, replaceDotsWithCommas, minToTime } from 'helpers/index'

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

// export const getAverageHours = (inp: string | number, numOfDays: number): number => {
//   if(inp === '') return 0
//   const floatNum = parseFloat(replaceCommasWithDots(inp.toString()))
//   const hoursPerDay = Math.round(floatNum / numOfDays * 100) / 100
//   return hoursPerDay
// }

export const extractHours = (minsTotal: number) => Math.floor(minsTotal / 60 ) || 0
export const extractMins  = (minsTotal: number) => minsTotal % 60

export const getAvgDailyMins = (workDays: {}, _weeklyHours: number | string): number => {
  const workDaysCount = Object.keys(workDays).length
  const weeklyHours = _weeklyHours ? (parseFloat(replaceCommasWithDots(_weeklyHours.toString())) || 0) : 0
  return Math.floor((weeklyHours * 60) / workDaysCount)
}

export const minsToDetailedTime = (mins: number): string => {
  const extractedHours     = minToTime(mins).hours
  const additionalMins     = minToTime(mins).minutes
  return `${extractedHours} Stunden ${additionalMins} Minuten`
}

export const getLatest = (weeklyHours: { [smartWeek: string]: string }) => {
  const latestSmartWeek =  Object.keys(weeklyHours).reduce((acc, val) => acc > val ? acc : val , '0')
  return weeklyHours[latestSmartWeek]
}
