//@flow

import React from 'react'
import { connect } from 'react-redux'
import { changeCurrentSmartWeek, goToLastWeek, goToNextWeek } from 'actions/ui'
import { getWeek } from 'helpers/index'
import './styles.css'

const WeekSelect = ({currentSmartWeek, goToNextWeek, goToLastWeek}) => {

  return(
    <fb className="weekSelectorMain">
      <fb className='weekDisplay'>{'KW ' + getWeek(currentSmartWeek)}</fb>
      <fb className='switchButton lastWeekButton icon icon-navigate_before' onClick={goToLastWeek}></fb>
      <fb className='switchButton nextWeekButton icon icon-navigate_next' onClick={goToNextWeek}></fb>
    </fb>
  )
}

const actionsToProps = {
  changeCurrentSmartWeek,
  goToLastWeek,
  goToNextWeek
}

const mapStateToProps = (state) => ({
  currentSmartWeek: state.ui.roster.currentSmartWeek
})

export default connect(mapStateToProps, actionsToProps)(WeekSelect)
