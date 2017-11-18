//@flow
import React from 'react'

import type { User, AbsenceType } from 'types/index'
import './styles.css'

type Props = {
  user: User,
  adminMode: boolean,
  daysSum?: number,
  type: AbsenceType | 'all',
}

export default ({user, adminMode, daysSum, type}: Props) => {
  const vacMode = type === 'vac'
  const { vacDays } = user

  const typeDaysGerman = {
    all: 'Abwesenheitstage',
    vac: 'Urlaubstage',
    ill: 'Krankheitstage',
    extra: 'Abwesenheitstage/Sonstiges'
  }

  return(
    <fb className='absenceUserCellMain'>
      { adminMode && <fb className='addAbsenceBtn' data-type='absence-user' data-user={user.id}>+</fb> }
      <fb className='userName'>{user.name}</fb>
        <fb className='daysSum' data-balloon={'Summe der ' + typeDaysGerman[type] + ' in 2017'}>
          <fb className='count'>{daysSum}</fb>
          { vacMode && vacDays && <fb className='vacDays'>{'/ ' + vacDays}</fb>}
        </fb>
    </fb>
  )
}
