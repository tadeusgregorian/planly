//@flow
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import type { Connector } from 'react-redux'

import { timeInpOK, withColon, from4To5, shiftDataValid, zipShift, shiftToShiftInput } from './localHelpers'
import { toggleOptions, unfocusShift }     from 'actions/ui/roster'
import { openNotesModal }                  from 'actions/ui/modals'
import { saveShiftToDB, saveShiftEditToDB, updateNoteOfShift }   from 'actions/roster'

import getCurrentUser from 'selectors/currentUser'


import ResolveEditBox from './resolveEditBox'
import InputWindow    from './inputWindow'
import ShiftTimesBar  from '../shiftTimesBar'
import ShiftEditBar   from '../shiftEditBar'
import ShiftActionBar from './shiftActionBar'

import type { Shift, Position, User, Store, MinimalShift } from 'types/index'
import './styles.css'

type OwnProps = {
  shift: Shift,
  inCreation?: boolean
}

type ConProps = {
  optionsExpanded: boolean,
  positions: Array<Position>,
  currentUser: User,
  aModalIsOpen: boolean,
  toggleOptions: ()=>{},
  saveShiftToDB: (Shift, ?boolean)=>any,
  saveShiftEditToDB: (string, MinimalShift)=>any,
  openNotesModal: (string, Function)=>any,
  unfocusShift: ()=>{},
  updateNoteOfShift: (string, string)=>any
}

type Props = OwnProps & ConProps

type State = {
  startTime: string,
  endTime: string,
  breakMinutes: string,
  position: string,
  note: string
}

type InputRefs = {
  startTime: ?HTMLInputElement,
  endTime: ?HTMLInputElement
}

class ModifyShiftBox extends PureComponent{
  state: State
  props: Props
  inputRefs: InputRefs
  isAdmin: boolean

  constructor(props){
    super(props)

    this.isAdmin = !!props.currentUser.isAdmin

    this.state = {
      startTime: '',
      endTime: '',
      breakMinutes: '',
      note: '',
      position: '' // positionID ( used for open shifts only )
    }

    this.inputRefs  = {
      startTime: null,
      endTime: null
    }
  }

  componentWillMount    = () => {if(!this.props.inCreation) this.populateState()}
  componentDidMount     = () => window.addEventListener('keydown', this.onKeyDown)
  componentWillUnmount  = () => window.removeEventListener('keydown', this.onKeyDown)

  populateState = () => {
    const { shift } = this.props
    this.setState({
      ...shiftToShiftInput(shift),
      position: shift.position,
      note: shift.note,
    })
  }

  componentDidUpdate = (pp: Props, ps: State) => {
    // used to move focus from the start- to endTime-inputField
    from4To5(ps.startTime, this.state.startTime) && this.focusEndTime()
  }

  startTimeChanged = (inp: SyntheticInputEvent) => this.updateStateIfOK('startTime', inp.target.value)
  endTimeChanged = (inp: SyntheticInputEvent) => this.updateStateIfOK('endTime', inp.target.value)
  breakChanged = (inp: SyntheticInputEvent) => this.updateBreakIfOK(inp.target.value)

  focusStartTime  = () => {this.inputRefs.startTime && this.inputRefs.startTime.focus()}
  focusEndTime    = () => {this.inputRefs.endTime   && this.inputRefs.endTime.focus()}

  updateStateIfOK = (target: string, newState: string) => {
    const prevState       = this.state[target]
    const colonizedState  = withColon(prevState, newState)
    if(timeInpOK(prevState, colonizedState)) this.setState({[target]: colonizedState})
  }

  updateBreakIfOK = (val) => {
    const newCharIsInt = !val.length || parseInt(val.slice(-1), 10) || val.slice(-1) === '0'
    if(newCharIsInt) this.setState({breakMinutes: val})
  }

  onKeyDown = (e: SyntheticKeyboardEvent) => {
    if(this.props.aModalIsOpen) return // neglect keysEvents if thers a modal
    e.key === 'Enter' && this.tryToSaveChanges()
    e.key === 'Escape' && this.props.unfocusShift()
  }

  tryToSaveChanges = () => {
    const { startTime, endTime, breakMinutes, note } = this.state
    const { saveShiftToDB, saveShiftEditToDB, unfocusShift, shift } = this.props
    const { day, user, id } = shift
    const shiftInput = { startTime, endTime, breakMinutes }

    if(shiftDataValid(shiftInput)){
      const minimalShift = zipShift(shiftInput)
      let shift = { ...minimalShift, day, user, id, note }

      this.isAdmin ? saveShiftToDB(shift) : saveShiftEditToDB(id, minimalShift)
      unfocusShift()
    }
  }

  deleteShift = () => {
    this.props.saveShiftToDB(this.props.shift, true)
    this.props.unfocusShift()
  }

  showShiftNote = () => this.props.openNotesModal( this.state.note, this.noteEdited )
  noteEdited = (noteTxt) => {
    this.setState({note: noteTxt})
    !this.props.inCreation && this.props.updateNoteOfShift(this.props.shift.id, noteTxt)
  }

  render(){
    const { shift } = this.props
    const isPending = !!this.props.shift.edit

    return(
      <fb className='modifyShiftBoxMain focused'>
        { isPending && <ResolveEditBox shift={shift} />}
        { !isPending && <ShiftActionBar
          shift={shift}
          inCreation={!!this.props.inCreation}
          unfocusShift={this.props.unfocusShift}
          toggleOptions={this.props.toggleOptions}
          showShiftNote={this.showShiftNote}
          deleteShift={this.deleteShift}
        />}
        { !isPending && <InputWindow
          startTime={this.state.startTime}
          endTime={this.state.endTime}
          breakMinutes={this.state.breakMinutes}
          getStartTimeRef={ref => {this.inputRefs.startTime = ref}}
          getEndTimeRef={ref => {this.inputRefs.endTime = ref}}
          startTimeChanged={this.startTimeChanged}
          endTimeChanged={this.endTimeChanged}
          breakChanged={this.breakChanged}
          focusStartTime={this.focusStartTime}
          focusEndTime={this.focusEndTime}
        /> }
        { isPending && <ShiftTimesBar shift={shift} /> }
        { isPending && <ShiftEditBar shift={shift} /> }
      </fb>
    )
  }
}

const actionCreators = {
  toggleOptions,
  unfocusShift,
  saveShiftToDB,
  saveShiftEditToDB,
  openNotesModal,
  updateNoteOfShift
}

const mapStateToProps = (state: Store) => ({
  optionsExpanded: state.ui.roster.shiftBoard.optionsExpanded,
  positions: state.core.positions,
  currentUser: getCurrentUser(state),
  aModalIsOpen: !!state.ui.modals.length
})

const connector: Connector<OwnProps, Props> = connect(mapStateToProps, actionCreators)
export default connector(ModifyShiftBox)
