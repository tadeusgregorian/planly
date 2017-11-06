//@flow
import moment from 'moment'

export const getYearsArray: (void)=>Array<number> = () => {
  let base = []
  const yearsDiff = moment().year() - 2017 + 3

  for(var i = 0; i<=yearsDiff; i++){
    base.push(2017 + i)
  }
  return base
}

type GetNextYM = (number, number)=>{ year: number, month: number }
export const getNextYM: GetNextYM = (year, month) => ({
  month: month === 11 ? 0        : month + 1,
  year:  month === 11 ? year + 1 : year
})

type GetPrevYM = (number, number)=>{ year: number, month: number }
export const getPrevYM: GetPrevYM = (year, month) => ({
  month: month === 0 ? 11       : month - 1,
  year:  month === 0 ? year - 1 : year
})

export const getMonthsArray: (void)=>Array<string> = () => {
  return ([
    ' Januar ',
    ' Februar ',
    ' März ',
    ' April ',
    ' Mai ',
    ' Juni ',
    ' Juli ',
    ' August ',
    ' September ',
    ' Oktober ',
    ' November ',
    ' Dezember ',
  ])
}
