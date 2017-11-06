//@flow

import React from 'react'
import { connect } from 'react-redux'
import type { Connector } from 'react-redux'
import type { Store } from 'types/index'

import WeekSelector from './weekSelector'
import DatePicker from 'react-datepicker'
import DateDisplay from './dateDisplay'
import EditsDisplay from './editsDisplay'
import ExtraHoursBar from './extraHoursBar'
import OptionsDropdown from './optionsDropdown'
import TimeDetailsToogler from './timeDetailsToogler'
import 'react-datepicker/dist/react-datepicker.css';
import { weekIDToMoment, momentToWeekID } from 'helpers/index'
import { changeCurrentWeekID, leaveExtraHoursMode } from 'actions/ui/roster'
import './styles.css'

type OwnProps = {}
type ConnectedProps = {
  currentWeekID: string,
  extraHoursMode: boolean,
  changeCurrentWeekID: (string) => {},
  leaveExtraHoursMode: ActionCreator,
}
type Props = OwnProps & ConnectedProps

const ActionBar = (props) => {
  const { leaveExtraHoursMode, currentWeekID, changeCurrentWeekID, extraHoursMode } = props

  return(
    <fb className="actionBarMain">
      <WeekSelector />
      <DatePicker
        selected={weekIDToMoment(currentWeekID)}
        onChange={(mom) => changeCurrentWeekID(momentToWeekID(mom))}
        filterDate={(mom) => mom.weekday() === 0}
        customInput={<DateDisplay mom={weekIDToMoment(currentWeekID)} />}
      />
      <fb className='right'>
        <TimeDetailsToogler />
        { extraHoursMode ? <ExtraHoursBar leave={leaveExtraHoursMode}/> : <OptionsDropdown /> }
        <EditsDisplay />
      </fb>
    </fb>
  )
}

const actionsToProps = {
  changeCurrentWeekID,
  leaveExtraHoursMode
}

const mapStateToProps = (state: Store) => ({
  currentWeekID: state.ui.roster.currentWeekID,
  extraHoursMode: state.ui.roster.extraHoursMode,
})

const connector: Connector<OwnProps, Props> = connect(mapStateToProps, actionsToProps)
export default connector(ActionBar)
