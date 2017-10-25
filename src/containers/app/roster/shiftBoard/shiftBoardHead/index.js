//@flow

import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import type { Connector } from 'react-redux'
import moment from 'moment'
import { weekDays, overtimeCellWidth } from 'constants/roster'
import { openModal } from 'actions/ui/modals'
import { getYear, getWeek } from 'helpers/roster'
import { hideNonWorkers } from 'actions/ui/roster'

import type { Day, Store, DayNote } from 'types/index'
import UsersHead from './usersHead'
import DayHead from './dayHead'
import './styles.css'

type OwnProps = {
  templateMode: boolean,
  weekID: string,
  adminMode: boolean,
}

type ConProps = {
  openModal: Function,
  hideNonWorkers: (boolean)=>any,
  dayNotes: Array<DayNote>,
  nonWorkersHidden: boolean,
}

type State = {
  dayHovered: string | null
}

class ShiftBoardHead extends PureComponent {
  props: OwnProps & ConProps
  state: State

  getDate = (day: number) => {
    if(this.props.templateMode) return null
    const year = getYear(this.props.weekID)
    const week = getWeek(this.props.weekID)
    const mom = moment().year(year).week(week).weekday(day)
    return mom.format('D.M')
  }

  openDayNote = (day: Day) => {
    this.props.openModal('DAY_NOTE', { day })
  }

  render(){
    const { templateMode, dayNotes, adminMode, hideNonWorkers, nonWorkersHidden } = this.props

    return(
      <fb className="shiftBoardHeadMain">
        { !templateMode && <fb className='oTime' style={{width: overtimeCellWidth}}>&sum;</fb> }
        <UsersHead hideNonWorkers={hideNonWorkers} nonWorkersHidden={nonWorkersHidden} />
        <fb className='weekDays'>
          { weekDays.map((w, i) =>
            <DayHead key={i}
              day={i}
              date={this.getDate(i)}
              adminMode={adminMode}
              openNote={this.openDayNote}
              dayNote={dayNotes.find(dN => dN.day === w)}/>
          )}
        </fb>
        { !templateMode && <fb className='oTime' style={{width: overtimeCellWidth}}>&sum;</fb> }
      </fb>
    )
  }
}

const actionCreators = {
  openModal,
  hideNonWorkers
}

const mapStateToProps = (state: Store) => ({
  dayNotes: state.roster.dayNotes,
  nonWorkersHidden: state.ui.roster.shiftBoard.nonWorkersHidden
})

const connector: Connector<OwnProps, OwnProps & ConProps> = connect(mapStateToProps, actionCreators)
export default connector(ShiftBoardHead)
