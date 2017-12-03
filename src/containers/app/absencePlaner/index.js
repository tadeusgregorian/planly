// @flow
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import type { Connector } from 'react-redux'

import { setAbsencesListener           } from 'actions/listeners/absencePlaner'
import { setAbsenceCorrectionsListener } from 'actions/listeners/absencePlaner'
import { getClickedAbsenceID, getClickedUserID } from './localHelpers'
import { openAbsenceModal, openModal } from 'actions/ui/modals'
import { setCurrentType } from 'actions/ui/absence'

import getCurrentUser from 'selectors/currentUser'
import getAbsencesFiltered from 'selectors/absencesFiltered'
import getAbsenceSums from 'selectors/absenceSums'

import AbsenceActionBar from './absenceActionBar'
import AbsenceCalendar from './absenceCalendar'
import AbsenceSubBar from './absenceSubBar'
import type { User, Store, DataStatus, Absence, AbsenceTypeFilter, AccountPreferences } from 'types/index'
import './styles.css'

type OwnProps = {}
type ConProps = {
  currentUser: User,
  absences: Array<Absence>,
  absenceSums: Array<{user: string, days: number}>,
  absencesDS: DataStatus,
  currentYear: number,
  currentType: AbsenceTypeFilter,
  setCurrentType: (AbsenceTypeFilter)=>any,
  openAbsenceModal: (string, (Absence | void))=>{},
  setAbsencesListener: (number)=>any,
  setAbsenceCorrectionsListener: ()=>any,
  openModal: (string)=>any,
  preferences: AccountPreferences,
}
type Props = OwnProps & ConProps

class AbsencePlaner extends PureComponent {
  props: Props

  componentDidMount = () => {
    const { currentYear, preferences } = this.props
    document.addEventListener('click', this.clickDetected)
    this.props.setAbsencesListener(currentYear)
    this.props.setAbsenceCorrectionsListener()
    console.log(typeof preferences.excludingSaturdays);
    typeof preferences.excludingSaturdays === 'undefined' && this.props.openModal('ABSENCE_SETTINGS')
  }

  componentWillUnmount  = () => {
    document.removeEventListener('click', this.clickDetected)
  }

  componentWillReceiveProps = (np: Props) => {
    if(np.currentYear !== this.props.currentYear){
      this.props.setAbsencesListener(np.currentYear)
    }
  }

  clickDetected = (e: any) => {
    const adminMode     = this.props.currentUser.isAdmin
    const userID        = getClickedUserID(e) // when a userCell gets clicked
    const absenceID     = getClickedAbsenceID(e) // when an absenceBar gets clicked
    const absence       = absenceID && this.props.absences.find(a => a.id === absenceID)
    const isOwnAbsence  = absence && absence.user === this.props.currentUser.id
    userID  && (adminMode) && this.props.openAbsenceModal(userID) // only admin can open absenceModal like this
    absence && (adminMode || isOwnAbsence) && this.props.openAbsenceModal(absence.user, absence) // nonAdmin can only open own Absence
  }

  render() {
    const { absences, absencesDS, currentUser, absenceSums, currentType, setCurrentType } = this.props

    return(
      <fb className="absenceMain">
        <AbsenceSubBar
          currentType={currentType}
          setCurrentType={setCurrentType}
        />
        <fb className='absenceContent'>
          <AbsenceActionBar
            currentUser={currentUser}
            adminMode={!!currentUser.isAdmin}
          />
          <AbsenceCalendar
            adminMode={!!currentUser.isAdmin}
            absences={absences}
            absenceSums={absenceSums}
            loading={absencesDS !== 'LOADED'}
          />
        </fb>
      </fb>
    )
  }
}

const actionCreators = {
  setAbsencesListener,
  setAbsenceCorrectionsListener,
  setCurrentType,
  openAbsenceModal,
  openModal
}

const mapStateToProps = (state: Store) => ({
  currentYear: state.ui.absence.currentYear,
  currentUser: getCurrentUser(state),
  absences: getAbsencesFiltered(state),
  absenceSums: getAbsenceSums(state),
  currentType: state.ui.absence.currentType,
  absencesDS: state.absencePlaner.absencesDataStatus,
  preferences: state.core.accountDetails.preferences,
})

const connector: Connector<OwnProps, Props> = connect(mapStateToProps, actionCreators)
export default connector(AbsencePlaner)
