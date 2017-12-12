//@flow
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import type { Connector } from 'react-redux'
import cn from 'classnames'
import values from 'lodash/values'

import { timeInpOK, withColon, from4To5, shiftDataValid, zipShift, shiftToShiftInput, shiftTimesIdentical } from './localHelpers'
import { toggleOptions, unfocusShift }     from 'actions/ui/roster'
import { openNotesModal }                  from 'actions/ui/modals'
import { saveShiftToDB, saveShiftEditToDB, updateNoteOfShift }   from 'actions/roster'

import getCurrentUser from 'selectors/currentUser'

import PickLocationBox  from './pickLocationBox'
import PickPositionBox  from './pickPositionBox'
import ResolveEditBox   from './resolveEditBox'
import GrabOpenShiftBox from './grabOpenShiftBox'
import InputWindow      from './inputWindow'
import ShiftTimesBar    from '../components/shiftTimesBar'
import PositionBar      from '../components/positionBar'
import LocationBar      from '../components/locationBar'
import ShiftActionBar   from './shiftActionBar'

import type { PreShift, ShiftRef, Position, User, Store, MinimalShift, Branch, Location } from 'types/index'
import './styles.css'

type OwnProps = {
  shift: PreShift,
  inCreation?: boolean,
  focused: boolean,
}

type ConProps = {
  optionsExpanded: boolean,
  positions: Array<Position>,
  currentUser: User,
  aModalIsOpen: boolean,
  focusedShiftRef: ?ShiftRef,
  branch: ?Branch,
  toggleOptions: ()=>{},
  saveShiftToDB: (PreShift, ?boolean)=>any,
  saveShiftEditToDB: (PreShift, MinimalShift)=>any,
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
  note: string,
  location: string,
  locationBoxOpen: boolean,
  positionBoxOpen: boolean,
  fadeIn: boolean,
}

type InputRefs = {
  startTime: ?HTMLInputElement,
  endTime: ?HTMLInputElement,
  break: ?HTMLInputElement,
}

class ModifyShiftBox extends PureComponent{
  state: State
  props: Props
  inputRefs: InputRefs
  isAdmin: boolean

  constructor(props){
    super(props)

    this.isAdmin = !!props.currentUser.isAdmin
    const { shift, inCreation } = props
    const { user, note, location, position } = shift

    this.state = {
      startTime: '',
      endTime: '',
      breakMinutes: '',
      note: note || '',
      location: location || '',
      position: (inCreation && user === 'open') ? 'all' : ( position || ''),
      locationBoxOpen: false,
      positionBoxOpen: false,
      fadeIn: false,
    }

    this.inputRefs  = {
      startTime: null,
      endTime: null,
      break: null
    }
  }

  componentWillMount    = () => {
    if(!this.props.inCreation) this.populateState()
  }
  componentWillUnmount  = () => {
    window.removeEventListener('keydown', this.onKeyDown)
  }
  componentDidMount     = () => {

    window.addEventListener('keydown', this.onKeyDown)
    setTimeout(()=>this.setState({ fadeIn: true }), 1)
  }

  populateState = () => {
    this.setState({ ...shiftToShiftInput(this.props.shift)})
  }

  componentDidUpdate = (pp: Props, ps: State) => {
    // used to move focus from the start- to endTime-inputField
    from4To5(ps.startTime, this.state.startTime) && this.focusEndTime()
    from4To5(ps.endTime, this.state.endTime) && this.focusBreak()
  }

  startTimeChanged = (inp: SyntheticInputEvent) => this.updateStateIfOK('startTime', inp.target.value)
  endTimeChanged   = (inp: SyntheticInputEvent) => this.updateStateIfOK('endTime', inp.target.value)
  breakChanged     = (inp: SyntheticInputEvent) => this.updateBreakIfOK(inp.target.value)

  focusStartTime  = () => {this.inputRefs.startTime && this.inputRefs.startTime.focus()}
  focusEndTime    = () => {this.inputRefs.endTime   && this.inputRefs.endTime.focus()}
  focusBreak      = () => {this.inputRefs.break     && this.inputRefs.break.focus()}

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
    const { startTime, endTime, breakMinutes, note, location, position } = this.state
    const { saveShiftToDB, saveShiftEditToDB, unfocusShift, shift } = this.props
    const { day, user, id } = shift
    const shiftInput = { startTime, endTime, breakMinutes }

    if(shiftDataValid(shiftInput)){
      const minimalShift = zipShift(shiftInput)
      let newShift = { ...minimalShift, day, user, id, note, location, position }

      unfocusShift() // need to unfocus shift before saving Shift -> this causes an additional flash-mount-unmount otherwise. // -> inCreation prop is causing this issue.
      if(!this.isAdmin && shiftTimesIdentical(shift, newShift)) return
      this.isAdmin ? saveShiftToDB(newShift) : saveShiftEditToDB(shift, minimalShift)
    }
  }

  deleteShift = () => {
    this.props.saveShiftToDB(this.props.shift, true)
    this.props.unfocusShift()
  }

  togglePositionBox = () => this.setState({positionBoxOpen: !this.state.positionBoxOpen})
  toggleLocationBox = () => this.setState({locationBoxOpen: !this.state.locationBoxOpen})
  showShiftNote     = () => this.props.openNotesModal( this.state.note, this.noteEdited )

  noteEdited = (noteTxt) => {
    this.setState({note: noteTxt})
    !this.props.inCreation && this.props.updateNoteOfShift(this.props.shift.id, noteTxt) // we update shit.note -> so the user doesnt need to save that shift in order to save the note
  }

  locationPicked = (locID: string) => this.setState({location: locID, locationBoxOpen: false})
  positionPicked = (posID: string) => this.setState({position: posID, positionBoxOpen: false})
  closeLocationBox = ()            => this.setState({locationBoxOpen: false})
  removeLocation = ()              => this.setState({location: ''})

  render(){
    const { shift, currentUser, branch, positions } = this.props
    const { locationBoxOpen, positionBoxOpen, location, position, note, fadeIn } = this.state
    const locations: Array<Location> = (branch && branch.locations && values(branch.locations)) || []
    const isGrabbing = !this.isAdmin && shift.user === 'open' // when a nonAdmin trys to grab an open Shift
    const isEdited   = !!shift.edit
    const isPending  = !!(isEdited || isGrabbing)

    return(
      <fb className={cn({modifyShiftBoxMain: 1, fadeIn})}>
        { isGrabbing && <GrabOpenShiftBox shift={shift} currentUser={currentUser} />}
        { isEdited   && <ResolveEditBox shift={shift} currentUser={currentUser} />}
        { locationBoxOpen && <PickLocationBox
          shiftRef={this.props.focusedShiftRef}
          locations={locations}
          closeLocationBox={this.toggleLocationBox}
          pickLoc={this.locationPicked}
          pickedLoc={location} />}
        { positionBoxOpen && <PickPositionBox
          shiftRef={this.props.focusedShiftRef}
          positions={positions}
          closePositionBox={this.togglePositionBox}
          pickPos={this.positionPicked}
          pickedPos={position} />}
        { !isPending && <ShiftActionBar
          hasNote={!!note}
          saveIt={this.tryToSaveChanges}
          inCreation={!!this.props.inCreation}
          withLocations={!!(locations && locations.filter(l => !l.deleted).length)}
          unfocusShift={this.props.unfocusShift}
          toggleOptions={this.props.toggleOptions}
          toggleLocationBox={this.toggleLocationBox}
          locationBoxOpen={this.state.locationBoxOpen}
          showShiftNote={this.showShiftNote}
          deleteShift={this.deleteShift}
          isAdmin={!!this.props.currentUser.isAdmin}
        />}
        { !isPending && <InputWindow
          startTime={this.state.startTime}
          endTime={this.state.endTime}
          breakMinutes={this.state.breakMinutes}
          getStartTimeRef={ref => {this.inputRefs.startTime = ref}}
          getEndTimeRef={ref => {this.inputRefs.endTime = ref}}
          getBreakRef={ref => {this.inputRefs.break = ref}}
          startTimeChanged={this.startTimeChanged}
          endTimeChanged={this.endTimeChanged}
          breakChanged={this.breakChanged}
          focusStartTime={this.focusStartTime}
          focusEndTime={this.focusEndTime}
          focusBreak={this.focusBreak}
        /> }
        { isPending && <ShiftTimesBar shift={shift} /> }
        { location && <LocationBar
          location={location}
          locations={locations}
          editable={!isPending}
          removeLocation={this.removeLocation}
          openLocationsBox={this.toggleLocationBox}
        /> }
        { position && <PositionBar
          position={position}
          positions={positions}
          editable={!isPending}
          openPositionBox={this.togglePositionBox}
        /> }
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
  aModalIsOpen: !!state.ui.modals.length,
  focusedShiftRef: state.ui.roster.shiftBoard.focusedShiftRef,
  branch: state.core.branches.find(b => b.id === state.ui.roster.currentBranch)
})

const connector: Connector<OwnProps, Props> = connect(mapStateToProps, actionCreators)
export default connector(ModifyShiftBox)
