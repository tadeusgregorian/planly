//@flow
import React, { PureComponent } from 'react'
import { cellChanged, timeInpOK, withColon, from4To5, shiftDataValid, zipShift, shiftToShiftInput } from './localHelpers'
import type { ShiftCell, Shift, Note } from 'types/index'
import InputWindow from './inputWindow'
import InputTongue from './inputTongue'
import CloseButton from './closeButton'
import ExpandedOptions from './expandedOptions'
import type { NoteModalProps } from 'actions/ui/modals'
import './styles.css'

type Props = {
  cell: ShiftCell,
  shift: Shift,
  optionsExpanded: boolean,
  note: Note,
  openNotesModal: (NoteModalProps)=>{},
  toggleOptions: ()=>void,
  saveShift: (Shift)=>void,
  closePopover: ()=>void,
  unfocusShiftCell: ()=>void
}
type State = {
  startTime: string,
  endTime: string,
  breakMinutes: string
}

type InputRefs = { startTime: ?HTMLInputElement, endTime: ?HTMLInputElement }

class CellPopover extends PureComponent {
  state: State
  props: Props
  inputRefs: InputRefs

  constructor(props: Props){
    super(props)

    this.state = {
      startTime: '',
      endTime: '',
      breakMinutes: ''
    }
    
    this.inputRefs  = {
      startTime: null,
      endTime: null
    }
  }

  componentWillMount = () => this.populateState(this.props.shift)

  populateState = (shift: Shift) => this.setState({ ...shiftToShiftInput(shift)})

  componentWillReceiveProps = (nextProps: Props) => {
    if(cellChanged(this.props.cell, nextProps.cell)) {
      this.populateState(nextProps.shift)
      nextProps.shift.e ? this.focusEndTime() : this.focusStartTime()
    }
  }

  componentDidUpdate = (pp: Props, ps: State) => {
    if (from4To5(ps.startTime, this.state.startTime)) this.focusEndTime()
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
    if(shiftDataValid({ ...this.state })){
      const { day, user } = this.props.cell
      const minimalShift = zipShift({ ...this.state })
      const shift = { ...minimalShift, day, user }
      this.props.saveShift(shift)
      this.props.unfocusShiftCell()
    }
  }

  render(){
    const { width, height, left, top } = this.props.cell
    const sizeAndPos = { width: width + 1, left , top: top - 1 }
    const { cell, toggleOptions, optionsExpanded, note, openNotesModal } = this.props

    return(
      <fb className="cellPopoverMain" style={sizeAndPos} onKeyDown={this.onKeyDown}>
        { optionsExpanded && <ExpandedOptions cell={cell} openNotesModal={openNotesModal} /> }
        <fb className='compact'>
          <InputWindow
            startTime={this.state.startTime}
            endTime={this.state.endTime}
            getStartTimeRef={ref => {this.inputRefs.startTime = ref}}
            getEndTimeRef={ref => {this.inputRefs.endTime = ref}}
            startTimeChanged={this.startTimeChanged}
            endTimeChanged={this.endTimeChanged}
            focusStartTime={this.focusStartTime}
            focusEndTime={this.focusEndTime}
            height={height}
            hasNote={!!note}
          />
          <CloseButton closePopover={this.props.closePopover} />
          <InputTongue value={this.state.breakMinutes} updateBreak={this.updateBreak} toggleOptions={toggleOptions}/>
        </fb>
      </fb>
    )
  }
}

export default CellPopover
