//@flow

import React from 'react'
import { connect } from 'react-redux'
import type { Connector } from 'react-redux'
import type { Store } from 'types/index'

import WeekSelector from './weekSelector'
import DatePicker from 'react-datepicker';
import DateDisplay from './dateDisplay'
import EditsDisplay from './editsDisplay'
import { smartWeekToMoment, momentToSmartWeek } from 'helpers/index'
import { changeCurrentSmartWeek } from 'actions/ui/roster'
import './styles.css'

type OwnProps = {}
type ConnectedProps = {
  currentSmartWeek: number,
  changeCurrentSmartWeek: (number) => {},
}
type Props = OwnProps & ConnectedProps

const ActionBar = (props) => {

  return(
    <fb className="actionBarMain">
      <WeekSelector />
      <DatePicker
        selected={smartWeekToMoment(props.currentSmartWeek)}
        onChange={(mom) => props.changeCurrentSmartWeek(momentToSmartWeek(mom))}
        filterDate={(mom) => mom.weekday() === 0}
        customInput={<DateDisplay mom={smartWeekToMoment(props.currentSmartWeek)} />}
      />
      <fb className='right'>
        <EditsDisplay />
      </fb>
    </fb>
  )
}

const actionsToProps = {
  changeCurrentSmartWeek
}

const mapStateToProps = (state: Store) => ({
  currentSmartWeek: state.ui.roster.currentSmartWeek
})

const connector: Connector<OwnProps, Props> = connect(mapStateToProps, actionsToProps)
export default connector(ActionBar)
