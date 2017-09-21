//@flow
import React from 'react'
import type { Shift, MinimalShift } from 'types/index'
import { minToTime } from 'helpers/index'
import cn from 'classnames'
import './styles.css'

type Props = {
  shift: Shift
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
        <fb className={cn({time: true, boldStyle: sEdited})}>{minToTime(edit.s).str}</fb>
        <fb className='seperator'>-</fb>
        <fb className={cn({time: true, boldStyle: eEdited})}>{minToTime(edit.e).str}</fb>
      </fb>
      { (!!edit.b || bEdited) && <fb className={cn({breakMinutes: true, boldStyle: bEdited})}>{'/ ' + edit.b}</fb>}
      <fb className='icon icon-pen pencilIcon' />
    </fb>
  )
}
