//@flow

import React from 'react'
import { connect } from 'react-redux'
import { goToLastWeek, goToNextWeek } from 'actions/ui/roster'
import { getWeek } from 'helpers/index'
import './styles.css'

import moment from 'moment'

const WeekSelect = ({currentWeekID, goToNextWeek, goToLastWeek}) => {

  console.log('HERE###:')
  console.log(moment().year(2018).week(53).startOf('week'))

  return(
    <fb className="weekSelectorMain">
      <fb className='weekDisplay'>{'KW ' + getWeek(currentWeekID)}</fb>
      <fb className='switchButton lastWeekButton icon icon-navigate_before' onClick={goToLastWeek}></fb>
      <fb className='switchButton nextWeekButton icon icon-navigate_next' onClick={goToNextWeek}></fb>
    </fb>
  )
}

const actionsToProps = {
  goToLastWeek,
  goToNextWeek
}

const mapStateToProps = (state) => ({
  currentWeekID: state.ui.roster.currentWeekID
})

export default connect(mapStateToProps, actionsToProps)(WeekSelect)
