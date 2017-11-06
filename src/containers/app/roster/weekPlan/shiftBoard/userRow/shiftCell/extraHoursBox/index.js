//@flow
import React from 'react'
import { connect } from 'react-redux'
import type { Connector } from 'react-redux'
import type { ExtraHours} from 'types/index'
import { openModal } from 'actions/ui/modals'
import { minToTime, withSign, extractHours } from 'helpers/roster'
import './styles.css'

type OwnProps = {
  extraHours: ExtraHours;
}

type ConProps = {
  openModal: Function
}

const extraHoursBox = ({extraHours, openModal}: ConProps & OwnProps) => {

  const overtimeShort = withSign(extractHours(extraHours.mins))
  const overtimeComplete = overtimeShort + ' h | ' + minToTime(extraHours.mins).minutes + '  min'
  const note = extraHours.note
  console.log(note);

  return(
    <fb
      className='extraHoursBoxMain'
      data-type='extra-hours-box'
      data-id={extraHours.id}
      data-balloon={note ? note : null}
    >
      {overtimeComplete}
      {note && <fb className='icon icon-comment commentIcon' />  }
    </fb>
  )
}

const actionCreators = {
  openModal
}

const connector: Connector<OwnProps, ConProps & OwnProps> = connect(null, actionCreators)
export default connector(extraHoursBox)
