// @flow
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import type { Connector } from 'react-redux'
import moment from 'moment'

import { setRequestedAbsencesListener } from 'actions/listeners/absencePlaner'
import { setAbsencesListener          } from 'actions/listeners/absencePlaner'
import { getClickedAbsenceID, getClickedUserID } from './localHelpers'
import { openAbsenceModal } from 'actions/ui/modals'

import getCurrentUser from 'selectors/currentUser'
import getAbsencesFiltered from 'selectors/absencesFiltered'
import getAbsenceSums from 'selectors/absenceSums'

import AbsenceActionBar from './absenceActionBar'
import AbsenceCalendar from './absenceCalendar'
import type { User, Store, DataStatus, Absence } from 'types/index'
import './styles.css'

type OwnProps = {}
type ConProps = {
  currentUser: User,
  absences: Array<Absence>,
  absenceSums: Array<{user: string, days: number}>,
  absencesDS: DataStatus,
  currentYear: number,
  openAbsenceModal: (string, (Absence | void))=>{},
  setAbsencesListener: (number)=>any,
  setRequestedAbsencesListener: ()=>any,
}
type Props = OwnProps & ConProps

class AbsencePlaner extends PureComponent {
  props: Props

  componentDidMount = () => {
    document.addEventListener('click', this.clickDetected)
    this.props.setAbsencesListener(moment().year())
    this.props.setRequestedAbsencesListener()
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
    const { absences, absencesDS, currentUser, absenceSums } = this.props
    console.log(absenceSums);

    return(
      <fb className="absenceMain">
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
  openAbsenceModal,
}

const mapStateToProps = (state: Store) => ({
  currentYear: state.ui.absence.currentYear,
  currentUser: getCurrentUser(state),
  absences: getAbsencesFiltered(state),
  absenceSums: getAbsenceSums(state),
  absencesDS: state.absencePlaner.absencesDataStatus,
})

const connector: Connector<OwnProps, Props> = connect(mapStateToProps, actionCreators)
export default connector(AbsencePlaner)
