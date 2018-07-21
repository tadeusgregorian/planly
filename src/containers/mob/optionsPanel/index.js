//@flow
import React, { PureComponent } from 'react'
import cn from 'classnames'
import { connect } from 'react-redux'
//import type { Connector } from 'react-redux'
import { withRouter } from 'react-router-dom'
import currentUser from 'selectors/currentUser';
import type { Store, User, Shift } from 'types/index'
import {saveShiftToDB, acceptEdit, rejectEdit, moveShiftTo} from 'actions/roster/index';
import type {SaveShiftToDBParams} from 'actions/roster/index';
import {unfocusShift, openSnackBar} from 'actions/ui/mobile';
import type { PreShift, Day } from 'types/index'
import './styles.css'

type ConProps = {
  currentUser: User,
  focusedShift: ?string,
  shiftWeek: Array<Shift>,
  unfocusShift: ()=>any,
  saveShiftToDB: (SaveShiftToDBParams)=>any,
  openSnackBar: ({ type: string, text: string })=>any,
  acceptEdit: (PreShift)=>any,
  rejectEdit: (PreShift)=>any,
  moveShiftTo: (shiftID: string, userID: string, Day)=>any
}

type OwnProps = {
  history: any
}

type Props = ConProps & OwnProps

type State = {
  overlayVisible: boolean,
  buttonsVisible: boolean,
  existent: boolean,
  confirmationMode: false | 'PICK_UP_OPEN_SHIFT' | 'DELETE'
}

class OptionsPanel extends PureComponent {
  state: State

  constructor(props: Props){
    super(props)

    this.state = {
      overlayVisible: false,
      buttonsVisible: false,
      existent: false,
      confirmationMode: false,
    }
  }

  componentDidUpdate = (prevProps) => {
    const shiftGotFocused = !prevProps.focusedShift && this.props.focusedShift
    const shiftGotUnfocused = prevProps.focusedShift && !this.props.focusedShift

    if(shiftGotFocused){
      this.setState({ existent: true })
      setTimeout(() => this.setState({ overlayVisible: true, buttonsVisible: true }), 1)
    }

    if(shiftGotUnfocused){
      this.setState({ overlayVisible: false, buttonsVisible: false   })
      setTimeout(() => this.setState({ existent: false }), 200)
    }
  }

  adminEditedShift = () => ([
    <fb className="optionBtn" key='1' onClick={()=>this.resolveEdit('accept')}>Bearbeitung annehmen</fb>,
    <fb className="optionBtn" key='2' onClick={()=>this.resolveEdit('reject')}>Bearbeitung ablehnen</fb>
  ])

  nonAdminEditedShift = () => (
    <fb className="optionBtn" onClick={()=>this.resolveEdit('reject')}>Bearbeitung entfernen</fb>
  )

  adminCleanShift = () => ([
    <fb className="optionBtn" key='1' onClick={this.toAddEditShift}>Schicht bearbeiten</fb>,
    <fb className="optionBtn" key='2' onClick={this.delteClicked}>Schicht löschen</fb>
  ])

  nonAdminCleanShift = () => (
    <fb className="optionBtn" onClick={this.toAddEditShift}>Schicht bearbeiten</fb>
  )

  nonAdminOpenShift = () => (
    <fb className="optionBtn" onClick={this.takeOpenShift}>Schicht übernehmen</fb>
  )

  renderDeleteConfirm = () => ([
    <fb key='1' className="optionsHeadline">Schicht wirklich löschen ?</fb>,
    <fb key='2' className="optionBtn" onClick={this.deleteShift}>Ja</fb>,
    <fb key='3' className="optionBtn" onClick={this.closePanel}>Nein</fb>
  ])

  renderPickOpenShiftConfirm = () => ([
    <fb key='1' className="optionsHeadline">Diese Schicht wirklich Übernehmen ?</fb>,
    <fb key='2' className="optionBtn" onClick={this.deleteShift}>Ja</fb>,
    <fb key='3' className="optionBtn" onClick={this.takeOpenShift}>Nein</fb>
  ])

  resolveEdit = (actions: 'accept' | 'reject') => {
    const shift: Shift = (this.getFocusedShift(): any)
    actions === 'accept' && this.props.acceptEdit(shift)
    actions === 'reject' && this.props.rejectEdit(shift)
    this.closePanel()
  }

  takeOpenShift = () => {
    const shift: Shift = (this.getFocusedShift(): any)
    //this.props.moveShiftTo(shift.id, this.props.currentUser.id, shift.day)
    this.doAndClose(
      this.props.moveShiftTo,
      [shift.id, this.props.currentUser.id, shift.day],
      'Schicht Übernommen'
    )
  }

  pickOpenShiftClicked = () => {
    this.setState({ buttonsVisible: false })
    setTimeout(()=>this.setState({ confirmationMode: 'PICK_UP_OPEN_SHIFT', buttonsVisible: true }), 200)
  }

  delteClicked = () => {
    this.setState({ buttonsVisible: false })
    setTimeout(()=>this.setState({ confirmationMode: 'DELETE', buttonsVisible: true }), 200)
  }

  deleteShift = () => {
    const shift: Shift = (this.getFocusedShift(): any)
    this.doAndClose( this.props.saveShiftToDB, [{ shifts: [shift], deleteIt: true }], 'Schicht gelöscht')
  }

  doAndClose = (func: Function, params: Array<any>, successText: string) => {
    func(...params)
      .then(() => {
        this.closePanel()
        this.props.openSnackBar({ type: 'SUCCESS', text: successText})
      })
      .catch(() => {
        this.closePanel()
        this.props.openSnackBar({ type: 'ERROR', text: 'Fehler'})
      })
  }

  toAddEditShift = () => {
    this.props.unfocusShift()
    this.props.history.push('/mob/addEditShift/' + (this.props.focusedShift || ''))
  }

  closePanel = () => {
    this.setState({ confirmationMode: false })
    this.props.unfocusShift()
  }

  getFocusedShift = (): ?Shift => {
    //$FlowFixMe
    const { focusedShift, shiftWeek } = this.props
    const shift = focusedShift && shiftWeek.find(s => s.id === focusedShift)
    return shift
  }

  renderContent = () => {
    const { confirmationMode } = this.state
    const shift = this.getFocusedShift()
    const openShift = shift && shift.user === 'open'
    const isEdited = shift && shift.edit
    const { isAdmin } = this.props.currentUser

    if(confirmationMode === 'DELETE') return this.renderDeleteConfirm()
    if(confirmationMode === 'PICK_UP_OPEN_SHIFT') return this.renderPickOpenShiftConfirm()
    if(!isAdmin && openShift) return this.nonAdminOpenShift()
    if(isAdmin  && isEdited) return this.adminEditedShift()
    if(!isAdmin && isEdited) return this.nonAdminEditedShift()
    if(isAdmin  && !isEdited) return this.adminCleanShift()
    if(!isAdmin && !isEdited) return this.nonAdminCleanShift()
  }

  render(){
    const { overlayVisible, buttonsVisible , existent, confirmationMode } = this.state
    const shift = this.getFocusedShift()
    const shiftHasNote = shift && shift.note

    return existent ? (
      <fb className={cn({mobileOptionsWrapper: 1})}>
        <fb className={cn({darkOverlay: 1, visible: overlayVisible})} onClick={this.closePanel}></fb>
        <fb className={cn({mobileOptionsMain: 1, visible: buttonsVisible})}  onClick={(e) => e.stopPropagation()}>
          { this.renderContent() }
          { !confirmationMode &&
            <fb className="optionBtn">{'Notiz' + (shiftHasNote ? '' : ' hinzufügen') }</fb>
          }
        </fb>
      </fb>
    )
    : <fb hidden></fb>
  }
}

const actionCreators = {
  unfocusShift,
  saveShiftToDB,
  openSnackBar,
  acceptEdit,
  rejectEdit,
  moveShiftTo
}

const mapStateToProps = (state: Store) => ({
  currentUser: currentUser(state),
  focusedShift: state.ui.mobile.focusedShift,
  shiftWeek: state.roster.shiftWeek
})

//const connector: Connector<OwnProps, ConProps> = connect(mapStateToProps, actionCreators)
export default withRouter(connect(mapStateToProps, actionCreators)(OptionsPanel))
