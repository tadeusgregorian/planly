//@flow
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import type { Connector } from 'react-redux'
import _ from 'lodash'

import { timeInpOK, withColon, from4To5, shiftDataValid, zipShift, shiftToShiftInput } from './localHelpers'
import { toggleOptions, unfocusShift }     from 'actions/ui/roster'
import { openNotesModal }                  from 'actions/ui/modals'
import { saveShiftToDB, saveShiftEditToDB, updateNoteOfShift }   from 'actions/roster'

import getCurrentUser from 'selectors/currentUser'

import PickLocationBox from './pickLocationBox'
import PickPositionBox from './pickPositionBox'
import ResolveEditBox  from './resolveEditBox'
import InputWindow     from './inputWindow'
import ShiftTimesBar   from '../components/shiftTimesBar'
import PositionBar    from '../components/positionBar'
import LocationBar     from '../components/locationBar'
import ShiftActionBar  from './shiftActionBar'

import type { PreShift, ShiftRef, Position, User, Store, MinimalShift, Branch, Location } from 'types/index'
import './styles.css'

type OwnProps = {
  shift: PreShift,
  inCreation?: boolean,
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
      note: props.shift.note || '',
      location: props.shift.location || '',
      position: (props.inCreation && props.shift.user === 'open') ? 'all' : (props.shift.position || ''),
      locationBoxOpen: false,
      positionBoxOpen: false,
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
    this.setState({ ...shiftToShiftInput(this.props.shift)})
  }

  componentDidUpdate = (pp: Props, ps: State) => {
    // used to move focus from the start- to endTime-inputField
    from4To5(ps.startTime, this.state.startTime) && this.focusEndTime()
  }

  startTimeChanged = (inp: SyntheticInputEvent) => this.updateStateIfOK('startTime', inp.target.value)
  endTimeChanged   = (inp: SyntheticInputEvent) => this.updateStateIfOK('endTime', inp.target.value)
  breakChanged     = (inp: SyntheticInputEvent) => this.updateBreakIfOK(inp.target.value)

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
    const { startTime, endTime, breakMinutes, note, location, position } = this.state
    const { saveShiftToDB, saveShiftEditToDB, unfocusShift, shift } = this.props
    const { day, user, id } = shift
    const shiftInput = { startTime, endTime, breakMinutes }

    if(shiftDataValid(shiftInput)){
      const minimalShift = zipShift(shiftInput)
      let shift = { ...minimalShift, day, user, id, note, location, position }

      this.isAdmin ? saveShiftToDB(shift) : saveShiftEditToDB(shift, minimalShift)
      unfocusShift()
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
    const { locationBoxOpen, positionBoxOpen, location, position, note } = this.state
    const locations: Array<Location> = (branch && branch.locations && _.values(branch.locations)) || []
    const isPending = !!this.props.shift.edit

    return(
      <fb className='modifyShiftBoxMain focused'>
        { isPending && <ResolveEditBox shift={shift} currentUser={currentUser} />}
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
        { location && <LocationBar
          location={location}
          locations={locations}
          editable={true}
          removeLocation={this.removeLocation}
          openLocationsBox={this.toggleLocationBox}
        /> }
        { position && <PositionBar
          position={position}
          positions={positions}
          editable={true}
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
