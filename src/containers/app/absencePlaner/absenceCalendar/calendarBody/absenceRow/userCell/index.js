//@flow
import React from 'react'
import cn from 'classnames'
//import WithTooltip from 'components/withTooltip'

import type { User, AbsenceType } from 'types/index'
import './styles.css'

type Props = {
  user: User,
  adminMode: boolean,
  daysSum?: number,
  type: AbsenceType | 'all',
}

export default ({user, adminMode, daysSum, type}: Props) => {
  const typeDaysGerman = {
    all: 'Abwesenheitstage',
    vac: 'Urlaubstage',
    ill: 'Krankheitstage',
    extra: 'Abwesenheitstage/Sonstiges'
  }

  return(
    <fb className='absenceUserCellMain' data-type='absence-user' data-user={user.id}>
      <fb className='userName'>{user.name}</fb>
      { !!daysSum &&
          <fb className='daysSum' data-balloon={'Summe der ' + typeDaysGerman[type] + ' in 2017'}>{daysSum + ' T'}</fb>
      }
      <fb className={cn({addAbsenceBtn: 1, adminMode: adminMode})}>
        <fb className='icon icon-plus'/>
      </fb>
    </fb>
  )
}
