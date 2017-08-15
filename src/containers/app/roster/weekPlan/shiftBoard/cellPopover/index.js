//@flow
import React, { PureComponent } from 'react'
import { cellChanged, timeInpOK, withColon, from4To5 } from './localHelpers'
import { minToTimeString } from 'helpers/index'
import type { focusedCellType, shiftType } from 'types/index'
import InputWindow from './inputWindow'
import BreakInput from './breakInput'
import './styles.css'

type Props = { cell: focusedCellType, shift: shiftType }
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

    this.state      = {
      startTime: '',
      endTime: '',
      breakMinutes: ''
    }
    this.inputRefs  = { startTime: null, endTime: null}
  }

  componentWillMount = () => this.populateState(this.props.shift)

  populateState = ({ e, s, b }: shiftType) => {
    const startTime     = Number.isInteger(s) ? minToTimeString(s) : ''
    const endTime       = Number.isInteger(e) ? minToTimeString(e) : ''
    const breakMinutes  = Number.isInteger(b) ? minToTimeString(e) : ''
    this.setState({ startTime, endTime, breakMinutes })
  }

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
  updateBreak:      InpCallback = (inp) => this.setState({breakMinutes: inp.target.value })

  focusStartTime  = () => {this.inputRefs.startTime && this.inputRefs.startTime.focus()}
  focusEndTime    = () => {this.inputRefs.endTime   && this.inputRefs.endTime.focus()}

  updateStateIfOK: UpdateStateIfOK = (target, newState) => {
    const prevState       = this.state[target]
    const colonizedState  = withColon(prevState, newState)
    if(timeInpOK(prevState, colonizedState)) this.setState({[target]: colonizedState})
  }

  render(){
    const { width, height, left, top } = this.props.cell
    const sizeAndPos = { width: width + 1, left , top: top - 1 }

    return(
      <fb className="cellPopoverMain" style={sizeAndPos}>
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
        />
        <BreakInput
          breakMinutes={this.state.breakMinutes}
          updateBreak={this.updateBreak}
        />
      </fb>
    )
  }
}

export default CellPopover
