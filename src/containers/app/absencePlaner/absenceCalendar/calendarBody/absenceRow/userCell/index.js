//@flow
import React from 'react'
import cn from 'classnames'

import type { User } from 'types/index'
import './styles.css'

type Props = {
  user: User,
  adminMode: boolean
}

export default ({user, adminMode}: Props) => {

  return(
    <fb className='absenceUserCellMain'>
      <fb className='userName'>{user.name}</fb>
      <fb
        className={cn({addAbsenceBtn: 1, adminMode: adminMode})}
        data-type='absence-user'
        data-user={user.id}>
          <fb className='icon icon-plus'/>
        </fb>
    </fb>
  )
}
