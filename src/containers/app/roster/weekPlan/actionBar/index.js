//@flow

import React from 'react'
import { connect } from 'react-redux'
import type { Connector } from 'react-redux'
import type { Store } from 'types/index'
import getCurrentUser from 'selectors/currentUser'

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
import type { User } from 'types/index'
import './styles.css'

type OwnProps = {}
type ConnectedProps = {
  currentWeekID: string,
  extraHoursMode: boolean,
  currentUser: User,
  changeCurrentWeekID: (string) => {},
  leaveExtraHoursMode: ActionCreator,
}
type Props = OwnProps & ConnectedProps

const ActionBar = (props) => {
  const { leaveExtraHoursMode, currentWeekID, changeCurrentWeekID, extraHoursMode } = props
  const adminMode = !!props.currentUser.isAdmin

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
        { adminMode && !extraHoursMode && <OptionsDropdown /> }
        { extraHoursMode && <ExtraHoursBar leave={leaveExtraHoursMode}/> }
        { adminMode && <EditsDisplay /> }
      </fb>
    </fb>
  )
}

const actionsToProps = {
  changeCurrentWeekID,
  leaveExtraHoursMode
}

const mapStateToProps = (state: Store) => ({
  currentUser: getCurrentUser(state),
  currentWeekID: state.ui.roster.currentWeekID,
  extraHoursMode: state.ui.roster.extraHoursMode,
})

const connector: Connector<OwnProps, Props> = connect(mapStateToProps, actionsToProps)
export default connector(ActionBar)
