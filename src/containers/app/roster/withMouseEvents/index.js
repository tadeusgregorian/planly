//@flow
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'

import { openModal } from 'actions/ui/modals'
import { focusShift, createShift, leaveExtraHoursMode }  from 'actions/ui/roster'
import { saveShiftToDB }                                from 'actions/roster'

import { getParentShift, getParentCell, sameShiftCells } from './localHelpers'
import { generateGuid } from 'helpers/index'
import getCurrentUser from 'selectors/currentUser'

import PickedUpShift        from './pickedUpShift'

import type { User, CellRef, ShiftRef, Shift, Shifts, Store, OvertimeStatus } from 'types/index'

type MSProps = {
  currentUser: User,
  shifts: Shifts,
  focusedShiftRef: ?ShiftRef,
  extraHoursMode: boolean,
}

type MAProps = {
  focusShift: (ShiftRef)=>any,
  createShift: (CellRef)=>any,
  saveShiftToDB: (Shift)=>any,
  openModal: (string, ?{}) => any,
  leaveExtraHoursMode: ActionCreator,
}

type OwnProps = {
  children: any
}

type Props = OwnProps & MSProps & MAProps

type State = {
  pickedUpShift: ?ShiftRef,
  isDragging: boolean,
  cellUnderMouse: ?CellRef,
}

class WithMouseLogic extends PureComponent<void, Props, State> {
  state: State
  props: Props

  currentUser: string
  adminMode: boolean
  mouseIsDown: boolean
  wasDraggingAround: boolean
  mousePosStart: {x: number, y: number}
  mousePosDelta: {x: number, y: number}
  PickedUpElement: ?HTMLElement


  constructor(props: Props){
    super(props)

    this.mouseIsDown = false
    this.wasDraggingAround = false
    this.currentUser = this.props.currentUser.id
    this.adminMode = !!(this.props.currentUser && this.props.currentUser.isAdmin)
    this.state = {
      pickedUpShift: null,
      isDragging: false,
      cellUnderMouse: null,
    }
  }

  componentDidMount = () => {
    document.addEventListener('click',   this.onClick)
    if(this.adminMode){ // only admin has drag and drop
      document.addEventListener('mousemove', this.onMouseMove)
      document.addEventListener('mouseover', this.onMouseOver)
      document.addEventListener('mousedown', this.onMouseDown)
      document.addEventListener('mouseup',   this.onMouseUp)
    }
  }

  componentWillUnmount = () => {
    document.removeEventListener('click',   this.onClick)
    if(this.adminMode){ // only admin has drag and drop
      document.removeEventListener('mouseover', this.onMouseOver)
      document.removeEventListener('mousemove', this.onMouseMove)
      document.removeEventListener('mousedown', this.onMouseDown)
      document.removeEventListener('mouseup',   this.onMouseUp)
    }
  }

  onMouseOver = ({target}: any) => {
    const { cellUnderMouse } = this.state
    const newCellUnderMouse = getParentCell(target)
    if(!sameShiftCells(newCellUnderMouse, cellUnderMouse)){
      this.setState({ cellUnderMouse: newCellUnderMouse })
    }
  }

  onMouseDown = (e: any) => { // this is used to start a dragging action
    this.wasDraggingAround = false
    const pressedShift = getParentShift(e.target)
    if (!pressedShift) return // continue only if a shift was mouseDowned
    if (pressedShift.hasEdit) return   // dont allow dragging cells with shiftEdit

    this.mousePosStart = {x: e.pageX, y: e.pageY}
    this.mouseIsDown = true
    setTimeout(()=> this.pickUpShift(pressedShift), 200)
  }

  onMouseUp = (target: any) => {
    this.mouseIsDown = false
    this.mousePosStart = {x: 0, y: 0}
    this.state.pickedUpShift && this.dropShift()
  }

  extendCellClicked = (target: any) => {
    const targetCell = getParentCell(target)
    targetCell && this.props.createShift(targetCell)
  }

  extraHoursSelected = (shiftCell: CellRef) => {
    const { user, day } = shiftCell
    this.props.openModal('EXTRA_HOURS', { user, day } )
    this.props.leaveExtraHoursMode()
  }

  oTimeCellClicked = (target: any) => {
    const user   = target.getAttribute('data-user')
    const status: OvertimeStatus = (target.getAttribute('data-status'): any)
    if(status === 'BEFORE_START' || status === 'STARTED') return // cant change initialOvertime in this cases
    this.props.openModal('INITIAL_OVERTIME', {user})
  }

  onClick = ({target}: any) => {
    if(!this.isDragging && !this.props.focusedShiftRef && !this.wasDraggingAround){
      const targetShift = getParentShift(target)
      const targetCell = getParentCell(target)

      if(this.props.extraHoursMode && targetCell)
        return this.extraHoursSelected(targetCell)

      if(target && target.getAttribute('data-type') === 'extend-cell-btn')
        return this.extendCellClicked(target)

      if(target && target.getAttribute('data-type') === 'pre-otime-cell')
        return this.oTimeCellClicked(target)

      if(targetShift && (targetShift.user === this.currentUser || this.adminMode))
        return this.props.focusShift(targetShift)

      if(targetCell && this.adminMode && !targetCell.hasShift)
        return this.props.createShift(targetCell)
    }
  }

  onMouseMove = (e: any) => {
    const { pickedUpShift } = this.state
    const dimensions = pickedUpShift && pickedUpShift.dimensions

    if (pickedUpShift && this.PickedUpElement && dimensions){
      this.mousePosDelta = {
        x: e.pageX - this.mousePosStart.x,
        y: e.pageY - this.mousePosStart.y
      }
      this.PickedUpElement.style.left = (dimensions.left + this.mousePosDelta.x) + 'px'
      this.PickedUpElement.style.top  = (dimensions.top + this.mousePosDelta.y) + 'px'
    }
  }

  pickUpShift = (shiftRef: ShiftRef) => {
    if(this.mouseIsDown){ // if mouse is already up again ( 200ms window ) -> no dragging
      this.setState({pickedUpShift: shiftRef, isDragging: true})

      const shiftBoard = document.getElementById("shiftBoardMain")
      shiftBoard && shiftBoard.classList.add('cursorMove') // to display a dragging cursor,  hacky I know...
    }
  }

  dropShift = () => {
    const { cellUnderMouse, pickedUpShift } = this.state
    const shift = this.props.shifts.find(s => pickedUpShift && s.id === pickedUpShift.id)

    if(shift && cellUnderMouse){
      const { s, e, b } = shift
      const { day, user } = cellUnderMouse
      const id = generateGuid()
      const newShift = { id, s, e, b, day, user }
      this.props.saveShiftToDB(newShift)
    }

    this.setState({pickedUpShift: null, isDragging: false})
    const shiftBoard = document.getElementById("shiftBoardMain")
    shiftBoard && shiftBoard.classList.remove('cursorMove')
  }


  render = () => {
    const { pickedUpShift, isDragging, cellUnderMouse } = this.state
    const getRef = (el) => { this.PickedUpElement = el }
    const shift = this.props.shifts.find(s => pickedUpShift && s.id === pickedUpShift.id)

    return (
      <fb style={{position: 'relative'}}>
        {React.cloneElement(this.props.children, { isDragging, cellUnderMouse })}
        { pickedUpShift && <PickedUpShift getRef={getRef} shiftRef={pickedUpShift} shift={shift}/> }
      </fb>
    )
  }
}

const actionsToProps: MAProps = {
  openModal,
  focusShift,
  createShift,
  saveShiftToDB,
  leaveExtraHoursMode
}

const mapStateToProps = (state: Store, ow: OwnProps): MSProps => ({
  currentUser: getCurrentUser(state),
  shifts: state.roster.shiftWeek,
  focusedShiftRef: state.ui.roster.shiftBoard.focusedShiftRef,
  extraHoursMode: state.ui.roster.extraHoursMode,
})

export default connect(mapStateToProps, actionsToProps)(WithMouseLogic)
