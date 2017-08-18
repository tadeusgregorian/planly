//@flow
import React, { PureComponent } from 'react'
import { cellChanged, timeInpOK, withColon, from4To5, shiftDataValid, zipShift, shiftToShiftInput } from './localHelpers'
import type { FocusedCell, Shift, MinimalShift, Note } from 'types/index'
import InputWindow from './inputWindow'
import InputTongue from './inputTongue'
import CloseButton from './closeButton'
import ExpandedOptions from './expandedOptions'
import './styles.css'

type Props = {
  cell: FocusedCell,
  shift: Shift,
  optionsExpanded: boolean,
  note: Note,
  toggleOptions: ()=>void,
  saveShift: (MinimalShift)=>void,
  closePopover: ()=>void
}
type State = { startTime: string, endTime: string, breakMinutes: string }

type InpCallback = (SyntheticInputEvent) =>void
type UpdateStateIfOK = (string, string) => void
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
    this.inputRefs  = { startTime: null, endTime: null}
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

  startTimeChanged: InpCallback = (inp) => this.updateStateIfOK('startTime', inp.target.value)
  endTimeChanged:   InpCallback = (inp) => this.updateStateIfOK('endTime', inp.target.value)
  updateBreak = (val: string) => this.setState({breakMinutes: val })

  focusStartTime  = () => {this.inputRefs.startTime && this.inputRefs.startTime.focus()}
  focusEndTime    = () => {this.inputRefs.endTime   && this.inputRefs.endTime.focus()}

  updateStateIfOK: UpdateStateIfOK = (target, newState) => {
    const prevState       = this.state[target]
    const colonizedState  = withColon(prevState, newState)
    if(timeInpOK(prevState, colonizedState)) this.setState({[target]: colonizedState})
  }

  onKeyDown = (e: SyntheticKeyboardEvent) => e.key === 'Enter' && this.tryToSaveChanges()
  tryToSaveChanges = () => {
    shiftDataValid({ ...this.state }) ?
      this.props.saveShift(zipShift({ ...this.state })) :
      console.log('WRONG')
  }

  render(){
    const { width, height, left, top } = this.props.cell
    const sizeAndPos = { width: width + 1, left , top: top - 1 }
    const { cell, shift, toggleOptions, optionsExpanded, note } = this.props

    return(
      <fb className="cellPopoverMain" style={sizeAndPos} onKeyDown={this.onKeyDown}>
        { optionsExpanded && <ExpandedOptions cell={cell} shift={shift} toggleOptions={toggleOptions} /> }
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
