//@flow
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import type { Connector } from 'react-redux'

import { shiftToString } from 'helpers/index'
import { timeInpOK, withColon, from4To5, shiftDataValid, zipShift, shiftToShiftInput } from './localHelpers'
import { toggleOptions, unfocusShift }        from 'actions/ui/roster'
import { openNotesModal }                     from 'actions/ui/modals'
import { saveShiftToDB, saveShiftEditToDB }   from 'actions/roster'

import getCurrentUser from 'selectors/currentUser'

import InputWindow from './inputWindow'

import type { ShiftCell, Shift, Position, User } from 'types/index'
import './styles.css'

type OwnProps = {
  shift: Shift,
  note: Note,
}

type Props = {
  optionsExpanded: boolean,
  positions: Array<Position>,
  currentUser: User,
  openNotesModal: ({})=>{},
  toggleOptions: ()=>void,
  saveShiftToDB: (Shift)=>void,
  saveShiftEditToDB: (Shift)=>void,
  unfocusShift: ()=>void
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

  constructor(props: Props){
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

  componentWillMount    = () => this.populateState(this.props.shift || { s: '', e: '', b: '' })
  componentDidMount     = () => window.addEventListener('keydown', this.onKeyDown)
  componentWillUnmount  = () => window.removeEventListener('keydown', this.onKeyDown)

  populateState = (shift: Shift) => {
    this.setState({ ...shiftToShiftInput(shift), position: shift.position })
  }

  componentDidUpdate = (pp: Props, ps: State) => {
    // used to move focus from the start- to endTime-inputField
    from4To5(ps.startTime, this.state.startTime) && this.focusEndTime()
  }

  startTimeChanged = (inp: SyntheticInputEvent) => this.updateStateIfOK('startTime', inp.target.value)
  endTimeChanged = (inp: SyntheticInputEvent) => this.updateStateIfOK('endTime', inp.target.value)
  updateBreak = (val: string) => this.setState({breakMinutes: val })

  focusStartTime  = () => {this.inputRefs.startTime && this.inputRefs.startTime.focus()}
  focusEndTime    = () => {this.inputRefs.endTime   && this.inputRefs.endTime.focus()}

  updateStateIfOK = (target: string, newState: string) => {
    const prevState       = this.state[target]
    const colonizedState  = withColon(prevState, newState)
    if(timeInpOK(prevState, colonizedState)) this.setState({[target]: colonizedState})
  }

  onKeyDown = (e: SyntheticKeyboardEvent) => e.key === 'Enter' && this.tryToSaveChanges()

  tryToSaveChanges = () => {
    const { startTime, endTime, breakMinutes, position } = this.state
    const { saveShiftToDB, saveShiftEditToDB, unfocusShift } = this.props
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
    const { shift, shiftEdit, note } = this.props
    const { day, user } = shift
    // const posBoxStyle = position && {
    //   color: position.color,
    //   backgroundColor: shadeColor(position.color, 0.8)
    // }

    return(
      <fb className='editShiftBoxMain focused'>
        {/* { position && <fb className='posBox' style={posBoxStyle}>{position.name}</fb> } */}
        <fb className='shiftTimesWrapper'>
          <fb className='shiftTimes'>{shiftToString(shift)}</fb>
          { !!shift.b && <fb className='breakTime'>{'/ ' + shift.b}</fb> }
        </fb>
        { shiftEdit && <fb className='edited icon icon-pen'>edited...</fb> }
        <fb className='footer'>
          { note  && <icon className='icon icon-comment hasNoteCellIcon' data-day={day} data-user={user} data-target-type='noteicon' />}
        </fb>
      </fb>
    )
  }
}

const actionCreators = {
  toggleOptions,
  openNotesModal,
  unfocusShift,
  saveShiftToDB,
  saveShiftEditToDB
}

const mapStateToProps = (state) => ({
  optionsExpanded: state.ui.roster.shiftBoard.optionsExpanded,
  positions: state.core.positions,
  shiftEdits: state.roster.shiftEdits,
  currentUser: getCurrentUser(state),
})

const connector: Connector<OwnProps, Props> = connect(mapStateToProps, actionCreators)
export default connector(ShiftBoard)





class CellPopover extends PureComponent {

  render(){
    return(<fb>underConstructions</fb>)

    // const { toggleOptions, optionsExpanded, openNotesModal } = this.props
    //
    // return(
    //   <fb className="cellPopoverMain">
    //     { optionsExpanded && <ExpandedOptions cell={cell} openNotesModal={openNotesModal} /> }
    //     <fb className='compact'>
    //       <InputWindow
    //         startTime={this.state.startTime}
    //         endTime={this.state.endTime}
    //         getStartTimeRef={ref => {this.inputRefs.startTime = ref}}
    //         getEndTimeRef={ref => {this.inputRefs.endTime = ref}}
    //         startTimeChanged={this.startTimeChanged}
    //         endTimeChanged={this.endTimeChanged}
    //         focusStartTime={this.focusStartTime}
    //         focusEndTime={this.focusEndTime}
    //       />
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
  }
}



export default CellPopover
