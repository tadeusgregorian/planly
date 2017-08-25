//@flow
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { cellChanged, timeInpOK, withColon, from4To5, shiftDataValid, zipShift, shiftToShiftInput } from './localHelpers'
import { toggleOptions } from 'actions/ui/roster'

import PositionsBubble from './positionsBubble'
import InputWindow from './inputWindow'
import InputTongue from './inputTongue'
import CloseButton from './closeButton'
import ExpandedOptions from './expandedOptions'
import './styles.css'

import type { ShiftCell, Shift, Note, Position } from 'types/index'
import type { NoteModalProps } from 'actions/ui/modals'

type Props = {
  cell: ShiftCell,
  shift: Shift,
  optionsExpanded: boolean,
  note: Note,
  positions: Array<Position>,
  openNotesModal: (NoteModalProps)=>{},
  toggleOptions: ()=>void,
  saveShift: (Shift)=>void,
  closePopover: ()=>void,
  unfocusShiftCell: ()=>void
}

type State = {
  startTime: string,
  endTime: string,
  breakMinutes: string,
  position: string
}

type InputRefs = { startTime: ?HTMLInputElement, endTime: ?HTMLInputElement }

class CellPopover extends PureComponent<void, Props, State> {
  state: State
  props: Props
  inputRefs: InputRefs

  constructor(props: Props){
    super(props)

    this.state = {
      startTime: '',
      endTime: '',
      breakMinutes: '',
      position: '' // positionID ( used for open shifts )
    }

    this.inputRefs  = {
      startTime: null,
      endTime: null
    }
  }

  componentWillMount = () => this.populateState(this.props.shift)

  componentDidMount     = () => window.addEventListener('keydown', this.onKeyDown)
  componentWillUnmount  = () => window.removeEventListener('keydown', this.onKeyDown)

  populateState = (shift: Shift) => {
    this.setState({
      ...shiftToShiftInput(shift),
      position: shift.position
    })
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
    const { day, user, isOpen } = this.props.cell
    const shiftInput = { startTime, endTime, breakMinutes }

    if(isOpen && !position) return
    if(shiftDataValid(shiftInput)){
      const minimalShift = zipShift(shiftInput)
      let shift = { ...minimalShift, day, user, isOpen: !!isOpen }
      if(isOpen) shift = { ...shift, isOpen, position }

      this.props.saveShift(shift)
      this.props.unfocusShiftCell()
    }
  }

  render(){
    const { width, height, left, top, isOpen } = this.props.cell
    const sizeAndPos = { width: width + 1, left , top: top - 1 }
    const { cell, toggleOptions, optionsExpanded, note, openNotesModal } = this.props

    return(
      <fb className="cellPopoverMain" style={sizeAndPos}>
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
          <InputTongue value={this.state.breakMinutes} updateBreak={this.updateBreak} toggleOptions={toggleOptions}/>
          <CloseButton closePopover={this.props.unfocusShiftCell} />
        </fb>
        { isOpen && <PositionsBubble
          positions={this.props.positions}
          selectedPos={this.state.position}
          selectPos={(posID) => this.setState({position: posID})} />
        }
      </fb>
    )
  }
}

const actionsToProps = {
  toggleOptions
}

const mapStateToProps = (state) => ({
  optionsExpanded: state.ui.roster.weekPlan.optionsExpanded,
  positions: state.core.positions
})

export default connect(mapStateToProps, actionsToProps)(CellPopover)
