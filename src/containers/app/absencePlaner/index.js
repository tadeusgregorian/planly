// @flow
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import type { Connector } from 'react-redux'

import { setRequestedAbsencesListener } from 'actions/listeners/absencePlaner'
import { setAbsencesListener          } from 'actions/listeners/absencePlaner'
import { getClickedAbsenceID, getClickedUserID } from './localHelpers'
import { openAbsenceModal } from 'actions/ui/modals'
import { setCurrentType } from 'actions/ui/absence'

import getCurrentUser from 'selectors/currentUser'
import getAbsencesFiltered from 'selectors/absencesFiltered'
import getAbsenceSums from 'selectors/absenceSums'

import AbsenceActionBar from './absenceActionBar'
import AbsenceCalendar from './absenceCalendar'
import AbsenceSubBar from './absenceSubBar'
import type { User, Store, DataStatus, Absence, AbsenceTypeFilter } from 'types/index'
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
  setAbsencesListener: ()=>any,
  setRequestedAbsencesListener: ()=>any,
}
type Props = OwnProps & ConProps

class AbsencePlaner extends PureComponent {
  props: Props

  componentDidMount = () => {
    document.addEventListener('click', this.clickDetected)
    this.props.setAbsencesListener()
    this.props.setRequestedAbsencesListener()
  }

  componentWillUnmount  = () => {
    document.removeEventListener('click', this.clickDetected)
  }

  componentWillReceiveProps = (np: Props) => {
    if(np.currentYear !== this.props.currentYear){
      this.props.setAbsencesListener()
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
  setRequestedAbsencesListener,
  setCurrentType,
  openAbsenceModal,
}

const mapStateToProps = (state: Store) => ({
  currentYear: state.ui.absence.currentYear,
  currentUser: getCurrentUser(state),
  absences: getAbsencesFiltered(state),
  absenceSums: getAbsenceSums(state),
  currentType: state.ui.absence.currentType,
  absencesDS: state.absencePlaner.absencesDataStatus,
})

const connector: Connector<OwnProps, Props> = connect(mapStateToProps, actionCreators)
export default connector(AbsencePlaner)
