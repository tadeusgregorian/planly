//@flow

import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import type { Connector } from 'react-redux'
import moment from 'moment'
import { weekDays, overtimeCellWidth } from 'constants/roster'
import { openModal } from 'actions/ui/modals'
import { hideNonWorkers } from 'actions/ui/roster'

import getDayHeadDates from 'selectors/dayHeadDates'
import UsersHead from './usersHead'
import DayHead from './dayHead'

import type { Day, Store, DayNote, BundeslandCode } from 'types/index'
import './styles.css'

type OwnProps = {
  templateMode: boolean,
  timeDetailsVisible: boolean,
  weekID: string,
  adminMode: boolean,
}

type ConProps = {
  openModal: Function,
  hideNonWorkers: (boolean)=>any,
  dayNotes: Array<DayNote>,
  nonWorkersHidden: boolean,
  bundeslandCode: BundeslandCode,
  dayHeadDates: Array<?moment>
}

type Props = OwnProps & ConProps

type State = {
  dayHovered: string | null
}

class ShiftBoardHead extends PureComponent {
  props: Props
  state: State
  todaySmart: string

  constructor(props: Props) {
    super(props)

    this.todaySmart = moment().format('DDMMYYYY')
  }

  openDayNote = (day: Day) => {
    this.props.openModal('DAY_NOTE', { day })
  }

  render(){
    const {
      templateMode,
      timeDetailsVisible,
      dayNotes,
      adminMode,
      hideNonWorkers,
      nonWorkersHidden,
      bundeslandCode,
      dayHeadDates } = this.props

      //console.log(getTodaySmart());

    return(
      <fb className="shiftBoardHeadMain">
        { !templateMode && timeDetailsVisible &&
          <fb className='oTime' style={{width: overtimeCellWidth}}>&sum;</fb>
        }
        <UsersHead hideNonWorkers={hideNonWorkers} nonWorkersHidden={nonWorkersHidden} />
        <fb className='weekDays'>
          { weekDays.map((w, i) =>
            <DayHead key={i}
              day={i}
              date={dayHeadDates[i] && dayHeadDates[i].format('D.M')}
              isToday={!!(dayHeadDates[i] && dayHeadDates[i].format('DDMMYYYY') === this.todaySmart)}
              //$FlowFixMe
              isHoliday={!!(dayHeadDates[i] && dayHeadDates[i].isHoliday(bundeslandCode))}
              adminMode={adminMode}
              openNote={this.openDayNote}
              dayNote={dayNotes.find(dN => dN.day === w)}/>
          )}
        </fb>
        { !templateMode && timeDetailsVisible &&
          <fb className='oTime' style={{width: overtimeCellWidth}}>&sum;</fb>
        }
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
  nonWorkersHidden: state.ui.roster.shiftBoard.nonWorkersHidden,
  bundeslandCode: state.core.accountDetails.preferences.bundesland,
  dayHeadDates: getDayHeadDates(state)
})

const connector: Connector<OwnProps, OwnProps & ConProps> = connect(mapStateToProps, actionCreators)
export default connector(ShiftBoardHead)
