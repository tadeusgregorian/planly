//@flow

import React from 'react'
import { connect } from 'react-redux'
import WeekSelector from './weekSelector'
import DatePicker from 'react-datepicker';
import DateDisplay from './dateDisplay'
import { smartWeekToMoment, momentToSmartWeek } from 'helpers/index'
import { changeCurrentSmartWeek } from 'actions/ui'
import './styles.css'

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
    </fb>
  )
}

const actionsToProps = {
  changeCurrentSmartWeek
}

const mapStateToProps = (state) => ({
  currentSmartWeek: state.ui.roster.currentSmartWeek
})

export default connect(mapStateToProps, actionsToProps)(ActionBar)
