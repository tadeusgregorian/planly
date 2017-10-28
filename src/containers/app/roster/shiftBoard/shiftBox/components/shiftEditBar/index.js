//@flow
import React from 'react'
import type { PreShift, MinimalShift } from 'types/index'
import { minToTimeString } from 'helpers/index'
import cn from 'classnames'
import './styles.css'

type Props = {
  shift: PreShift
}

export default ({shift}: Props) => {
  const edit: MinimalShift = (shift.edit: any)
  const original = { s: shift.s, e: shift.e, b: shift.b }
  const sEdited = original.s !== edit.s
  const eEdited = original.e !== edit.e
  const bEdited = original.b !== edit.b


  return(
    <fb className="shiftEditBarMain">
      <fb className='startEndTime'>
        <fb className={cn({time: true, boldStyle: sEdited})}>{minToTimeString(edit.s)}</fb>
        <fb className='seperator'>-</fb>
        <fb className={cn({time: true, boldStyle: eEdited})}>{minToTimeString(edit.e)}</fb>
      </fb>
      { (!!edit.b || bEdited) && <fb className={cn({breakMinutes: true, boldStyle: bEdited})}>{'/ ' + edit.b}</fb>}
    </fb>
  )
}
