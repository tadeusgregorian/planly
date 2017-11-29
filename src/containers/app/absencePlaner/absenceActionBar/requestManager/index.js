//@flow
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import type { Connector } from 'react-redux'
import cn from 'classnames'

import { smartToMom } from 'helpers/index'
import { smartDateToYear } from 'helpers/roster'
import { setCurrentBranch, setCurrentYear, setCurrentMonth, setCurrentType } from 'actions/ui/absence'
import { openAbsenceModal } from 'actions/ui/modals'

import RequestsPopover from './requestsPopover'

import type { Store, User, AbsenceType, Absence } from 'types/index'
import './styles.css'


type OwnProps = {}

type ConProps = {
  currentBranch: string,
  currentYear: number,
  currentMonth: number,
  currentType: AbsenceType | 'all',
  openAbsenceModal: (string, Absence | void)=>any,
  setCurrentBranch: (string)=>any,
  setCurrentYear:   (number)=>any,
  setCurrentMonth:  (number)=>any,
  setCurrentType:   (AbsenceType | 'all')=>any,
  users: Array<User>,
  vacationRequests: Array<Absence>,
}

class RequestManager extends PureComponent {
  props:  OwnProps & ConProps
  state:  { isOpen: boolean }
  state = { isOpen: false }

  closePopover  = () => this.setState({ isOpen: false })
  togglePopover = () => this.setState({ isOpen: !this.state.isOpen })

  openRequest = (absence: Absence) => {
    this.props.openAbsenceModal(absence.user, absence)
  }

  jumpToRequest = (vacRequest: Absence) => {
    const { currentBranch, currentYear, currentMonth, currentType, users } = this.props
    const { setCurrentBranch, setCurrentYear, setCurrentMonth, setCurrentType } = this.props

    const user: User = (users.find(u => u.id === vacRequest.user): any)
    const startMonth = smartToMom(vacRequest.startDate).month() // watch out months go from 0 - 11, also currentMonth: 0 - 11

    currentBranch !== 'all' && !user.branches[currentBranch] && setCurrentBranch('all')
    currentType   !== 'all' && currentType !== 'vac'         && setCurrentType('all')
    currentYear   !== vacRequest.year                        && setCurrentYear(smartDateToYear(vacRequest.startDate))
    currentMonth  !== startMonth                             && setCurrentMonth(startMonth)

  }

  render(){
    const count = this.props.vacationRequests.length
    const label = count + (count === 1 ? ' Antrag' : ' Anträge')

    return(
      <fb className="absenceRequestsManagerMain">
        <fb
          className={cn({soBtn: 1, requestsBtn: 1, disabled: !count})}
          onClick={()=> count && this.togglePopover()}
        >
          {label}
        </fb>
        { this.state.isOpen && <RequestsPopover
          vacationRequests={this.props.vacationRequests}
          users={this.props.users}
          openRequest={this.openRequest}
          jumpToRequest={this.jumpToRequest}
          closePopover={this.closePopover}/>
        }
      </fb>
    )
  }
}

const actionCreators = {
  setCurrentBranch,
  setCurrentYear,
  setCurrentMonth,
  setCurrentType,
  openAbsenceModal,
}

const mapStateToProps = (state: Store) => ({
  currentBranch: state.ui.absence.currentBranch,
  currentYear: state.ui.absence.currentYear,
  currentMonth: state.ui.absence.currentMonth,
  currentType: state.ui.absence.currentType,
  users: state.core.users,
  vacationRequests: state.absencePlaner.vacationRequests,
})

const connector: Connector<OwnProps, ConProps & OwnProps> = connect(mapStateToProps, actionCreators)
export default connector(RequestManager)
