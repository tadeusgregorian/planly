//@flow
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import type { Connector } from 'react-redux'
import Select from 'react-select';
import getActiveBranches from 'selectors/activeBranches'

import { openAbsenceModal } from 'actions/ui/modals'
import { setCurrentBranch, setCurrentYear, setCurrentMonth, setCurrentType } from 'actions/ui/absence'
import { getYearsArray, getMonthsArray, getNextYM, getPrevYM } from './localHelpers'

import RequestManager from './requestManager'
import RequestVacBtn from './requestVacBtn'
import MonthStepper from './monthStepper'

import type { Branch, AbsenceType, Store, Absence, User } from 'types/index'
import './styles.css'

type OwnProps = {
  adminMode: boolean,
  currentUser: User,
}

type ConProps = {
  branches: Array<Branch>,
  currentBranch: string,
  currentYear: number,
  currentMonth: number,
  openAbsenceModal: (string, Absence | void)=>any,
  setCurrentBranch: (string)=>any,
  setCurrentYear:   (number)=>any,
  setCurrentMonth:  (number)=>any,
  setCurrentType:   (AbsenceType | 'all')=>any,
}

class AbsenceActionBar extends PureComponent {
  props: ConProps & OwnProps

  onChangeBranch = (opt: any) => this.props.setCurrentBranch(opt.value)
  onChangeYear   = (opt: any) => this.props.setCurrentYear(opt.value)
  onChangeMonth  = (opt: any) => this.props.setCurrentMonth(opt.value)
  requestVacClicked = () => this.props.openAbsenceModal(this.props.currentUser.id)

  stepForward = () => {
    const nextYM = getNextYM(this.props.currentYear, this.props.currentMonth)
    this.props.setCurrentYear(nextYM.year)
    this.props.setCurrentMonth(nextYM.month)
  }

  stepBack = () => {
    const prevYM = getPrevYM(this.props.currentYear, this.props.currentMonth)
    this.props.setCurrentYear(prevYM.year)
    this.props.setCurrentMonth(prevYM.month)
  }

  render(){
    const { currentBranch, currentYear, currentMonth, branches, adminMode } = this.props

    const branchOptions = branches.map(b => ({value: b.id, label: b.name}))
                          .concat({value: 'all', label: 'Alle Standorte'})

    const yearOptions   = getYearsArray().map(y => ({value: y, label: y}))
    const monthOptions  = getMonthsArray().map((y, i) => ({value: i, label: y}))

    return(
      <fb className="absenceActionBarMain">
        <fb className='absenceActionBarContent'>
          <div className='branchSelect'>
            <Select
              value={currentBranch}
              options={branchOptions}
              onChange={this.onChangeBranch}
              clearable={false}
              searchable={false}
            />
          </div>
          <div className='yearSelect'>
            <Select
              value={currentYear}
              options={yearOptions}
              onChange={this.onChangeYear}
              clearable={false}
              searchable={false}
            />
          </div>
          <div className='monthSelect'>
            <Select
              value={currentMonth}
              options={monthOptions}
              onChange={this.onChangeMonth}
              clearable={false}
              searchable={false}
            />
          </div>
          <MonthStepper
            stepBack={this.stepBack}
            stepForward={this.stepForward}
          />
           { adminMode
             ? <RequestManager />
             : <RequestVacBtn onClick={this.requestVacClicked}/>}
        </fb>
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
  branches: getActiveBranches(state),
  currentBranch: state.ui.absence.currentBranch,
  currentYear: state.ui.absence.currentYear,
  currentMonth: state.ui.absence.currentMonth,
})

const connector: Connector<OwnProps, ConProps & OwnProps> = connect(mapStateToProps, actionCreators)
export default connector(AbsenceActionBar)
