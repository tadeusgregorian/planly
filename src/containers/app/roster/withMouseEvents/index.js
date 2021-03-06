//@flow
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'

import { openModal } from 'actions/ui/modals'
import { focusShift, createShift, leaveExtraHoursMode }  from 'actions/ui/roster'
import { copyShiftTo, moveShiftTo }                      from 'actions/roster'

import { getParentShift, getParentShiftEl, getParentCellEl, getParentCell, sameShiftCells, canFocus } from './localHelpers'
import getCurrentUser from 'selectors/currentUser'

import type { User, Day, CellRef, ShiftRef, Store, OvertimeStatus } from 'types/index'

type MSProps = {
  currentUser: User,
  focusedShiftRef: ?ShiftRef,
  extraHoursMode: boolean,
}

type MAProps = {
  focusShift: (ShiftRef)=>any,
  createShift: (CellRef)=>any,
  copyShiftTo: (string, string, Day )=>any,
  moveShiftTo: (string, string, Day )=>any,
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
  originCell: ?CellRef,
}

class WithMouseLogic extends PureComponent<void, Props, State> {
  state: State
  props: Props

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
    this.adminMode = !!(this.props.currentUser && this.props.currentUser.isAdmin)
    this.state = {
      pickedUpShift: null,
      isDragging: false,
      cellUnderMouse: null,
      originCell: null,
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
    const { originCell } = this.state
    const newCellUnderMouse = getParentCell(target)
    const cellUnderMouse = sameShiftCells(newCellUnderMouse, originCell) ? null : newCellUnderMouse
    this.setState({ cellUnderMouse })
  }

  onMouseDown = (e: any) => { // this is used to start a dragging action
    this.wasDraggingAround = false
    const pressedShift = getParentShift(e.target)
    const shiftElement = getParentShiftEl(e.target)
    const cellElement  = getParentCellEl(e.target)
    //const shiftElement = getParentShiftEl(e.target)
    if (!pressedShift) return          // continue only if a shift was mouseDowned
    if (!shiftElement) return          // is redundant check ( to satisfy Flow )
    if (!cellElement)  return          // is redundant check ( to satisfy Flow )
    if (pressedShift.hasEdit) return   // dont allow dragging cells with shiftEdit

    this.mousePosStart = {x: e.pageX, y: e.pageY}
    this.mouseIsDown = true
    setTimeout(()=> this.pickUpShift(pressedShift, shiftElement, cellElement), 200)
  }

  onMouseUp = (target: any) => {
    console.log('onMouseUp');
    this.mouseIsDown = false
    this.mousePosStart = {x: 0, y: 0}
    this.state.isDragging && this.dropShift()
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

  extraHoursClicked = (target: any) =>{
    const id   = target.getAttribute('data-id')
    this.props.openModal('EXTRA_HOURS', { id })
  }

  oTimeCellClicked = (target: any) => {
    const user   = target.getAttribute('data-user')
    const status: OvertimeStatus = (target.getAttribute('data-status'): any)
    if(status === 'BEFORE_START' || status === 'STARTED') return // cant change initialOvertime in this cases
    this.props.openModal('INITIAL_OVERTIME', {user})
  }

  onClick = ({target}: any) => {
    if(!this.props.focusedShiftRef && !this.wasDraggingAround){
      const targetShift = getParentShift(target)
      const targetCell = getParentCell(target)

      if(this.props.extraHoursMode && targetCell) // to create new ExtraHours
        return this.adminMode && this.extraHoursSelected(targetCell)

      if(target && target.getAttribute('data-type') === 'extra-hours-box') // to open existing ExtraHours
        return this.adminMode && this.extraHoursClicked(target)

      if(target && target.getAttribute('data-type') === 'extend-cell-btn') // to add another Shift to a shiftCell
        return this.adminMode && this.extendCellClicked(target)

      if(target && target.getAttribute('data-type') === 'pre-otime-cell') // overtimeCell Left or Right
        return this.adminMode && this.oTimeCellClicked(target)

      if(targetShift && (this.adminMode || canFocus(this.props.currentUser, targetShift)))
        return this.props.focusShift(targetShift)

      if(targetCell && this.adminMode && !targetCell.hasShift)
        return this.props.createShift(targetCell)
    }
    this.wasDraggingAround = false;
  }

  onMouseMove = (e: any) => {

    if(this.PickedUpElement){
      this.mousePosDelta = {
        x: e.pageX - this.mousePosStart.x,
        y: e.pageY - this.mousePosStart.y
      }

      this.PickedUpElement.style.left = (this.mousePosDelta.x) + 'px'
      this.PickedUpElement.style.top  = (this.mousePosDelta.y) + 'px'
    }
  }

  pickUpShift = (shiftRef: ShiftRef, shiftEl: HTMLElement, cellEl: HTMLElement ) => {
    if(this.mouseIsDown){ // if mouse is already up again ( 200ms window ) -> no dragging
      this.wasDraggingAround = true;
      const originCell = { user: shiftRef.user, day: shiftRef.day, hasShift: true }
      this.setState({ pickedUpShift: shiftRef, isDragging: true, originCell, cellUnderMouse: null })

      const shiftClone = shiftEl.cloneNode(true)
      this.PickedUpElement    = shiftClone

      shiftClone.className    += ' dragged'
      shiftClone.style.width  = shiftEl.offsetWidth + 'px'
      cellEl.appendChild(shiftClone)

      const shiftBoard = document.getElementById("shiftBoardMain")
      shiftBoard && shiftBoard.classList.add('cursorMove') // to display a dragging cursor,  hacky I know...
    }
  }

  dropShift = () => {
    const { cellUnderMouse, pickedUpShift } = this.state
    const { copyShiftTo, moveShiftTo }      = this.props

    if(pickedUpShift && cellUnderMouse){
      const { day, user } = cellUnderMouse
      const fromOpenToUser = pickedUpShift.user === 'open' && user !== 'open'
      const fromUserToOpen = pickedUpShift.user !== 'open' && user === 'open'
      const justMoveShift  = fromOpenToUser || fromUserToOpen

      justMoveShift
       ? moveShiftTo(pickedUpShift.id, user, day )
       : copyShiftTo(pickedUpShift.id, user, day )
    }

    this.setState({ pickedUpShift: null, isDragging: false, originCell: null })
    //$FlowFixMe
    this.PickedUpElement.parentNode.removeChild(this.PickedUpElement)
    const shiftBoard = document.getElementById("shiftBoardMain")
    shiftBoard && shiftBoard.classList.remove('cursorMove')
  }


  render = () => {
    const { isDragging, cellUnderMouse } = this.state

    return (
      React.cloneElement(this.props.children, { isDragging, cellUnderMouse })
    )
  }
}

const actionsToProps: MAProps = {
  openModal,
  focusShift,
  createShift,
  copyShiftTo,
  moveShiftTo,
  leaveExtraHoursMode
}

const mapStateToProps = (state: Store, ow: OwnProps): MSProps => ({
  currentUser: getCurrentUser(state),
  focusedShiftRef: state.ui.roster.shiftBoard.focusedShiftRef,
  extraHoursMode: state.ui.roster.extraHoursMode,
})

export default connect(mapStateToProps, actionsToProps)(WithMouseLogic)
