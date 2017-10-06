//@flow
import { replaceCommasWithDots } from 'helpers/index'

export const sumWorkHours = (workHours: Array<string | number>): number => {
  const minutesSum = workHours.reduce((acc, val) => {

    const num = floatToMins(val)
    return num + acc

  }, 0)
  //console.log(minutesSum);
  //console.log(Math.round((minutesSum / 60) * 100) / 100);
  return Math.round((minutesSum / 60) * 100) / 100
}

const floatToMins = (inp: string | number): number => {
  if(inp === '') return 0
  const floatNum = parseFloat(replaceCommasWithDots(inp.toString()))
  const minsDec = Math.round(floatNum % 1 * 100) / 100 // round to 2 decimals ( random bug... )
  const hours = floatNum - minsDec
  const mins = Math.round(minsDec * 60)
  const minsTotal = hours * 60 + mins
  return parseFloat(minsTotal)
}

export const getAverageHours = (inp: string | number, numOfDays: number): number => {
  if(inp === '') return 0
  const floatNum = parseFloat(replaceCommasWithDots(inp.toString()))
  console.log(floatNum);
  console.log(numOfDays);
  const hoursPerDay = Math.round(floatNum / numOfDays * 100) / 100
  return hoursPerDay
}
