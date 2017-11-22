//@flow
import React from 'react'
import AbsenceTypeBtn from './absenceTypeBtn'
import type { AbsenceTypeFilter } from 'types/index'
import { absenceTypes } from 'constants/absence'
import './styles.css'

type Props = {
  currentType: AbsenceTypeFilter,
  setCurrentType: (AbsenceTypeFilter)=>any
}

export default (props: Props) => {
  const { currentType } = props

  const typeClicked = (type) => {
    props.setCurrentType(type);
  }

  return(
    <fb className="absenceSubBarMain">
      <fb className='center'>
        { absenceTypes.map( a =>
          <AbsenceTypeBtn
            key={a.type}
            type={a.type}
            label={a.label}
            onClick={typeClicked}
            active={a.type === currentType}
          />
        )}
      </fb>
    </fb>
  )
}
