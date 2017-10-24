//@flow
import React from 'react'
import { connect } from 'react-redux'
import type { Connector } from 'react-redux'
import type { ExtraHours} from 'types/index'
import { openModal } from 'actions/ui/modals'
import { minToTime } from 'helpers/roster'
import './styles.css'

type OwnProps = {
  extraHours: ExtraHours;
}

type ConProps = {
  openModal: Function
}


const extraHoursBox = ({extraHours, openModal}: ConProps & OwnProps) => {

  const onClick = () => {
    openModal('EXTRA_HOURS',  extraHours)
  }

  const roundDown = (num) => Math.floor(Math.abs(num) / 60)
  const withSign  = (num) => num < 0 ? '- ' + num.toString().substring(1) : '+ ' + num

  const overtimeShort = withSign(roundDown(extraHours.mins))
  const overtimeComplete = overtimeShort + ' h | ' + minToTime(extraHours.mins).minutes + '  min'

  return(
    <fb className='extraHoursBoxMain' onClick={onClick}>
      {overtimeComplete}
    </fb>
  )
}



const actionCreators = {
  openModal
}

const connector: Connector<OwnProps, ConProps & OwnProps> = connect(null, actionCreators)
export default connector(extraHoursBox)
