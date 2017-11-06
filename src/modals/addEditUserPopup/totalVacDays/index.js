//@flow
import React from 'react'
import { isIntStr } from 'helpers/index'
import './styles.css'

type Props = {
  vacDays: string,
  onChange: (string)=>any,
}

export default ({vacDays, onChange}: Props) => {

  const inpChanged = (inp: string) => {
    isIntStr(inp) && onChange(inp)
  }

  return(
    <fb className='totalVacDaysMain'>
      <fb className='label'>Urlaubsanspruch</fb>
      <fb className='inpWrapper mins'>
        <input type='text' value={vacDays} onChange={(e)=>inpChanged(e.target.value)}/>
      </fb>
      <fb className='seperator'>Tage</fb>
    </fb>
  )
}
