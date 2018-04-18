//@flow
import React, { PureComponent } from 'react'
import cn from 'classnames'
import { connect } from 'react-redux'
//import type { Connector } from 'react-redux'
import { withRouter } from 'react-router-dom'
import currentUser from 'selectors/currentUser';
import type { Store, User, Shift } from 'types/index'
import {unfocusShift} from 'actions/ui/mobile';
import './styles.css'

type ConProps = {
  currentUser: User,
  focusedShift: ?string,
  shiftWeek: Array<Shift>,
  unfocusShift: ()=>any,
}

type OwnProps = {
  history: any
}

type Props = ConProps & OwnProps

type State = {
  visible: boolean,
  existent: boolean,
}

class OptionsPanel extends PureComponent {
  state: State

  constructor(props: Props){
    super(props)

    this.state = {
      visible: false,
      existent: false
    }
  }

  componentDidUpdate = (prevProps) => {
    const shiftGotFocused = !prevProps.focusedShift && this.props.focusedShift
    const shiftGotUnfocused = prevProps.focusedShift && !this.props.focusedShift

    if(shiftGotFocused){
      this.setState({ existent: true })
      setTimeout(() => this.setState({ visible: true }), 1)
    }

    if(shiftGotUnfocused){
      this.setState({ visible: false })
      setTimeout(() => this.setState({ existent: false }), 200)
    }
  }

  adminEditedShift = () => ([
    <fb className="optionBtn" key='1'>Bearbeitung annehmen</fb>,
    <fb className="optionBtn" key='2'>Bearbeitung ablehnen</fb>
  ])

  nonAdminEditedShift = () => (
    <fb className="optionBtn">Bearbeitung entfernen</fb>
  )

  adminCleanShift = () => ([
    <fb className="optionBtn" key='1' onClick={this.toAddEditShift}>Schicht bearbeiten</fb>,
    <fb className="optionBtn" key='2'>Schicht löschen</fb>
  ])

  nonAdminCleanShift = () => (
    <fb className="optionBtn" onClick={this.toAddEditShift}>Schicht bearbeiten</fb>
  )

  toAddEditShift = () => {
    this.props.unfocusShift()
    this.props.history.push('/mob/addEditShift/' + (this.props.focusedShift || ''))
  }

  render(){
    const { currentUser, focusedShift, shiftWeek, unfocusShift } = this.props
    const { visible, existent } = this.state
    const { isAdmin } = currentUser
    const shift = focusedShift && shiftWeek.find(s => s.id === focusedShift)
    const isEdited = shift && shift.edit
    const shiftHasNote = shift && shift.note

    return existent ? (
      <fb className={cn({mobileOptionsWrapper: 1})}>
        <fb className={cn({darkOverlay: 1, visible})} onClick={unfocusShift}></fb>
        <fb className={cn({mobileOptionsMain: 1, visible})}  onClick={(e) => e.stopPropagation()}>
          { isAdmin  && isEdited  && this.adminEditedShift() }
          { !isAdmin && isEdited  && this.nonAdminEditedShift() }
          { isAdmin  && !isEdited && this.adminCleanShift() }
          { !isAdmin && !isEdited && this.nonAdminCleanShift() }
          <fb className="optionBtn">{'Notiz' + (shiftHasNote ? '' : ' hinzufügen') }</fb>
        </fb>
      </fb>
    )
    : <fb hidden></fb>
  }
}

const actionCreators = {
  unfocusShift
}

const mapStateToProps = (state: Store) => ({
  currentUser: currentUser(state),
  focusedShift: state.ui.roster.mobile.focusedShift,
  shiftWeek: state.roster.shiftWeek
})

//const connector: Connector<OwnProps, ConProps> = connect(mapStateToProps, actionCreators)
export default withRouter(connect(mapStateToProps, actionCreators)(OptionsPanel))
