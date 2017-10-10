//@flow

import React from 'react'
import { connect } from 'react-redux'
import type { Connector } from 'react-redux'
import type { Store } from 'types/index'

import WeekSelector from './weekSelector'
import DatePicker from 'react-datepicker'
import DateDisplay from './dateDisplay'
import EditsDisplay from './editsDisplay'
import OptionsDropdown from './optionsDropdown'
import { weekIDToMoment, momentToWeekID } from 'helpers/index'
import { changeCurrentWeekID } from 'actions/ui/roster'
import './styles.css'

type OwnProps = {}
type ConnectedProps = {
  currentWeekID: string,
  changeCurrentWeekID: (string) => {},
}
type Props = OwnProps & ConnectedProps

const ActionBar = (props) => {

  return(
    <fb className="actionBarMain">
      <WeekSelector />
      <DatePicker
        selected={weekIDToMoment(props.currentWeekID)}
        onChange={(mom) => props.changeCurrentWeekID(momentToWeekID(mom))}
        filterDate={(mom) => mom.weekday() === 0}
        customInput={<DateDisplay mom={weekIDToMoment(props.currentWeekID)} />}
      />
      <fb className='right'>
        <OptionsDropdown />
        <EditsDisplay />
      </fb>
    </fb>
  )
}

const actionsToProps = {
  changeCurrentWeekID
}

const mapStateToProps = (state: Store) => ({
  currentWeekID: state.ui.roster.currentWeekID
})

const connector: Connector<OwnProps, Props> = connect(mapStateToProps, actionsToProps)
export default connector(ActionBar)
