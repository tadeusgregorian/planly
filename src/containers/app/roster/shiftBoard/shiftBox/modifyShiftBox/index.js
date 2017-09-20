//@flow
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import type { Connector } from 'react-redux'

//import { shiftToString } from 'helpers/index'
import { timeInpOK, withColon, from4To5, shiftDataValid, zipShift, shiftToShiftInput } from './localHelpers'
import { toggleOptions, unfocusShift }        from 'actions/ui/roster'
import { openNotesModal }                     from 'actions/ui/modals'
import type { NoteModalProps }                from 'actions/ui/modals'
import { saveShiftToDB, saveShiftEditToDB }   from 'actions/roster'

import getCurrentUser from 'selectors/currentUser'

import InputWindow from './inputWindow'
import ShiftActionBar from './shiftActionBar'

import type { ShiftEdit, Shift, Position, User, Store } from 'types/index'
import './styles.css'

type OwnProps = {
  shift: Shift,
  shiftEdit: ?ShiftEdit,
  inCreation?: boolean
}

type ConProps = {
  optionsExpanded: boolean,
  positions: Array<Position>,
  currentUser: User,
  toggleOptions: ()=>{},
  saveShiftToDB: (Shift)=>any,
  saveShiftEditToDB: (Shift)=>any,
  openNotesModal: (NoteModalProps)=>void,
  unfocusShift: ()=>{}
}

type Props = OwnProps & ConProps

type State = {
  startTime: string,
  endTime: string,
  breakMinutes: string,
  position: string
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
    this.setState({ ...shiftToShiftInput(shift), position: shift.position })
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
    e.key === 'Enter' && this.tryToSaveChanges()
    e.key === 'Escape' && this.props.unfocusShift()
  }

  tryToSaveChanges = () => {
    const { startTime, endTime, breakMinutes } = this.state
    const { saveShiftToDB, saveShiftEditToDB, unfocusShift, shift } = this.props
    const { day, user, id } = shift
    const shiftInput = { startTime, endTime, breakMinutes }

    if(shiftDataValid(shiftInput)){
      const minimalShift = zipShift(shiftInput)
      let shift = { ...minimalShift, day, user, id }

      this.isAdmin ? saveShiftToDB(shift) : saveShiftEditToDB(shift)
      unfocusShift()
    }
  }

  render(){
    const { shift, shiftEdit } = this.props
    const { day, user } = shift
    // const posBoxStyle = position && {
    //   color: position.color,
    //   backgroundColor: shadeColor(position.color, 0.8)
    // }

    return(
      <fb className='modifyShiftBoxMain focused'>
        {/* { position && <fb className='posBox' style={posBoxStyle}>{position.name}</fb> } */}
        <ShiftActionBar
          inCreation={!!this.props.inCreation}
          closeClicked={this.props.unfocusShift}
          toggleOptionsClicked={()=>{}}
          deleteClicked={()=>{}}
        />
        <fb className='shiftTimesWrapper'>
          <InputWindow
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
          />
        </fb>
        { shiftEdit && <fb className='edited icon icon-pen'>edited...</fb> }
        <fb className='footer'>
          { false  && <icon className='icon icon-comment hasNoteCellIcon' data-day={day} data-user={user} data-target-type='noteicon' />}
        </fb>
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
}

const mapStateToProps = (state: Store) => ({
  optionsExpanded: state.ui.roster.shiftBoard.optionsExpanded,
  positions: state.core.positions,
  shiftEdits: state.roster.shiftEdits,
  currentUser: getCurrentUser(state),
})

const connector: Connector<OwnProps, Props> = connect(mapStateToProps, actionCreators)
export default connector(ModifyShiftBox)



// const { toggleOptions, optionsExpanded, openNotesModal } = this.props
//
// return(
//   <fb className="cellPopoverMain">
//     { optionsExpanded && <ExpandedOptions cell={cell} openNotesModal={openNotesModal} /> }
//     <fb className='compact'>
//       <InputTongue value={this.state.breakMinutes} updateBreak={this.updateBreak} toggleOptions={toggleOptions}/>
//       <CloseButton closePopover={this.props.unfocusShiftCell} />
//     </fb>
//     { isOpen && <PositionsBubble
//       positions={this.props.positions}
//       selectedPos={this.state.position}
//       selectPos={(posID) => this.setState({position: posID})} />
//     }
//   </fb>
// )
