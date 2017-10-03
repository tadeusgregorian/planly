//@flow
import moment from 'moment'

export const getYearsArray: (void)=>Array<number> = () => {
  let base = []
  const yearsDiff = moment().year() - 2017 + 1

  for(var i = 0; i<=yearsDiff; i++){
    base.push(2017 + i)
  }
  return base
}

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
