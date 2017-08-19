//@flow
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import type { userType, Shift, Shifts, ShiftCell, Note } from 'types/index'
import getFocusedShift from 'selectors/focusedShift'
import { toggleOptions } from 'actions/ui/roster'
import { elementIsShiftCell, elementIsNoteIcon, targetToShiftCell, getParentShiftCell, getShiftOfCell } from './localHelpers'
import UserRow from './userRow'
import CellPopover from './cellPopover'
import { openNotesModal } from 'actions/ui'
import type { NoteModalProps } from 'actions/ui/modals'
import PickedUpCell from './pickedUpCell'
import './styles.css'

type Props = {
  users: [userType],
  shifts: Shifts,
  notes: Array<Note>,
  focusedCell: ShiftCell,
  focusedShift: Shift,
  optionsExpanded: boolean,
  toggleOptions: ()=>void,
  focusShiftCell: ({}) => void,
  saveShift: (Shift)=> void,
  unfocusShiftCell: ()=>void,
  openNotesModal: (NoteModalProps)=>{}
}

class ShiftBoard extends PureComponent{
  props: Props
  cellUnderMouse: ?ShiftCell
  mouseIsDown: boolean
  isDragging: boolean
  mousePosStart: {x: number, y: number}
  mousePosDelta: {x: number, y: number}
  PickedUpCellRef: ?HTMLElement
  state: { pickedUpCell: ?ShiftCell, shadowedCell: ?ShiftCell }

  constructor(props: Props){
    super(props)

    this.mouseIsDown = false
    this.state = { pickedUpCell: null, shadowedCell: null }
  }

  componentDidMount = () => {
    document.addEventListener('mouseover', this.onMouseOver)
    document.addEventListener('mousemove', this.onMouseMove)
    document.addEventListener('mousedown', this.onMouseDown)
    document.addEventListener('mouseup',   this.onMouseUp)
  }

  componentWillUnmount = () => {
    document.removeEventListener('mouseover', this.onMouseOver)
    document.removeEventListener('mousemove', this.onMouseMove)
    document.removeEventListener('mousedown', this.onMouseDown)
    document.removeEventListener('mouseup',   this.onMouseUp)
  }

  onMouseOver = ({target}: any) => {
    if(!this.mouseIsDown) return
    this.cellUnderMouse = getParentShiftCell(target)
    //dont allow to shadow Cells that already have a shift.
    if(this.cellUnderMouse && getShiftOfCell(this.props.shifts, this.cellUnderMouse)){
      this.cellUnderMouse = null
    }
    this.setState({shadowedCell: this.cellUnderMouse})
  }

  onMouseDown = (e: any) => {
    const pressedCell = getParentShiftCell(e.target)
    if (!pressedCell) return
    // dont allow picking cells Up that dont have shifts
    if (!getShiftOfCell(this.props.shifts, pressedCell)) return
    this.mousePosStart = {x: e.pageX, y: e.pageY}
    this.mouseIsDown = true
    setTimeout(()=> this.pickUpCell(pressedCell), 200)
  }

  onMouseUp = ({target}: any) => {
    if(!this.isDragging){
      const shiftCell = targetToShiftCell(target)
      elementIsNoteIcon(target)  && this.props.openNotesModal({ day: shiftCell.day, user: shiftCell.user , type: 'shiftNote'})
      elementIsShiftCell(target) && this.props.focusShiftCell(shiftCell)
    }

    this.mouseIsDown = false
    this.mousePosStart = {x: 0, y: 0}
    this.state.pickedUpCell && this.dropCell()
  }

  onMouseMove = (e: any) => {
    if (!this.state.pickedUpCell || !this.PickedUpCellRef) return
    this.mousePosDelta = {
      x: e.pageX - this.mousePosStart.x,
      y: e.pageY - this.mousePosStart.y
    }
    this.PickedUpCellRef.style.left = (this.state.pickedUpCell.left + this.mousePosDelta.x) + 'px'
    this.PickedUpCellRef.style.top =  (this.state.pickedUpCell.top + this.mousePosDelta.y) + 'px'
  }

  pickUpCell = (cell) => {
    if(this.mouseIsDown){
      this.isDragging = true
      this.setState({pickedUpCell: cell})
      const shiftBoard = document.getElementById("shiftBoardMain")
      shiftBoard && shiftBoard.classList.add('cursorMove')
    }
  }

  dropCell = () => {
    const { shadowedCell, pickedUpCell } = this.state
    const { shifts, saveShift } = this.props
    if(pickedUpCell && shadowedCell){
      const pickedUpShift =  getShiftOfCell(shifts, pickedUpCell)
      if(shadowedCell && pickedUpShift){
        const newShift = { ...pickedUpShift, day: shadowedCell.day, user: shadowedCell.user }
        saveShift(newShift)
      }
    }

    this.isDragging = false
    this.setState({pickedUpCell: null, shadowedCell: null})
    const shiftBoard = document.getElementById("shiftBoardMain")
    shiftBoard && shiftBoard.classList.remove('cursorMove')
  }


  render(){
    const { users, shifts, focusedCell, focusedShift, optionsExpanded, notes } = this.props
    const { pickedUpCell, shadowedCell } = this.state
    return(
      <fb id="shiftBoardMain">
        <fb className='content'>
          { users.map(user => {
            const shiftsOfUser = shifts.filter(s => s.user === user.id)
            const notesOfUser  = notes.filter(n => n.user === user.id)
            const highlightedDay = optionsExpanded && focusedCell && focusedCell.user === user.id && focusedCell.day
            const shadowedDay = (!!shadowedCell) && shadowedCell.user === user.id && shadowedCell.day
            return <UserRow
              key={user.id}
              user={user}
              shifts={shiftsOfUser}
              notes={notesOfUser}
              shadowedDay={shadowedDay}
              highlightedDay={highlightedDay}/>
          })}
        </fb>
        { focusedCell &&
          <CellPopover
            cell={focusedCell}
            shift={focusedShift}
            note={notes.find(n => n.user === focusedCell.user && n.day === focusedCell.day )}
            openNotesModal={this.props.openNotesModal}
            saveShift={this.props.saveShift}
            unfocusShiftCell={this.props.unfocusShiftCell}
            toggleOptions={this.props.toggleOptions}
            optionsExpanded={optionsExpanded}
            closePopover={this.props.unfocusShiftCell}/>
          }
          { pickedUpCell &&
            <PickedUpCell
              getRef={(el:HTMLElement) => {this.PickedUpCellRef = el}}
              shift={getShiftOfCell(shifts, pickedUpCell)}
              cell={pickedUpCell} />
          }
      </fb>
    )
  }
}

const actionsToProps = {
  toggleOptions,
  openNotesModal
}

const mapStateToProps = (state) => ({
  users: state.core.users,
  focusedShift: getFocusedShift(state),
  optionsExpanded: state.ui.roster.weekPlan.optionsExpanded,
})

export default connect(mapStateToProps, actionsToProps)(ShiftBoard)
