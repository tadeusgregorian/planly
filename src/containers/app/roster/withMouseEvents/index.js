//@flow
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'

import { focusShift, createShift, setShiftUnderMouse }  from 'actions/ui/roster'
import { saveShiftToDB }                                from 'actions/roster'

import { getParentShift, getParentCell } from './localHelpers'
import { generateGuid } from 'helpers/index'
import getCurrentUser from 'selectors/currentUser'

import PickedUpShift from './pickedUpShift'

import type { User, ShiftCell, ShiftRef, Shift, Shifts, Store } from 'types/index'

type MSProps = {
  currentUser: User,
  shifts: Shifts,
  focusedShiftRef: ?ShiftRef,
  shiftUnderMouse: ?ShiftRef
}

type MAProps = {
  focusShift: (ShiftRef)=>any,
  createShift: (ShiftCell)=>any,
  saveShiftToDB: (Shift)=>any,
  setShiftUnderMouse: (ShiftRef | null)=>any,
}

type OwnProps = {
  children: any
}

type Props = OwnProps & MSProps & MAProps

type State = {
  pickedUpShift: ?ShiftRef,
  shadowedCell: ?ShiftCell
}

class WithMouseLogic extends PureComponent<void, Props, State> {
  state: State
  props: Props

  currentUser: string
  adminMode: boolean
  mouseIsDown: boolean
  isDragging: boolean
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
      shadowedCell: null
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
    if(this.isDragging){
      this.wasDraggingAround = true;
      const cellUnderMouse = getParentCell(target)
      const shadowedCell = cellUnderMouse || null
      this.setState({shadowedCell: shadowedCell})

    } else {
      if(this.props.focusedShiftRef) return
      const { shiftUnderMouse } = this.props
      const newShiftUnderMouse = getParentShift(target)
      const id = shiftUnderMouse && shiftUnderMouse.id
      const newId = newShiftUnderMouse && newShiftUnderMouse.id
      if(id !== newId) {
        this.props.setShiftUnderMouse(newShiftUnderMouse)
      }
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

  onClick = ({target}: any) => {
    if(!this.isDragging && !this.props.focusedShiftRef && !this.wasDraggingAround){

      const extendCellClicked = target && target.getAttribute('data-target-type') === 'extend-cell-btn'
      if(extendCellClicked){
        const targetCell = getParentCell(target)
        targetCell && this.props.createShift(targetCell)
        return
      }

      const targetShift = getParentShift(target)
      if(targetShift){
        if(targetShift.user === this.currentUser || this.adminMode){
          return this.props.focusShift(targetShift)
        }
      }

      const targetCell = getParentCell(target)
      if(targetCell && this.adminMode && !targetCell.hasShift) return this.props.createShift(targetCell)


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
      this.isDragging = true
      this.setState({pickedUpShift: shiftRef})

      const shiftBoard = document.getElementById("shiftBoardMain")
      shiftBoard && shiftBoard.classList.add('cursorMove')
    }
  }

  dropShift = () => {
    const { shadowedCell, pickedUpShift } = this.state
    const shift = this.props.shifts.find(s => pickedUpShift && s.id === pickedUpShift.id)

    if(shift && shadowedCell){
      const { s, e, b } = shift
      const { day, user } = shadowedCell
      const id = generateGuid()
      const newShift = { id, s, e, b, day, user }
      this.props.saveShiftToDB(newShift)
    }

    this.isDragging = false
    this.setState({pickedUpShift: null, shadowedCell: null})
    const shiftBoard = document.getElementById("shiftBoardMain")
    shiftBoard && shiftBoard.classList.remove('cursorMove')
  }

  render = () => {
    const { pickedUpShift, shadowedCell } = this.state
    const getRef = (el) => { this.PickedUpElement = el }
    const shift = this.props.shifts.find(s => pickedUpShift && s.id === pickedUpShift.id)

    return (
      <fb style={{position: 'relative'}}>
        {React.cloneElement(this.props.children, { shadowedCell })}
        { pickedUpShift && <PickedUpShift getRef={getRef} shiftRef={pickedUpShift} shift={shift}/> }
      </fb>
    )
  }
}

const actionsToProps: MAProps = {
  focusShift,
  createShift,
  saveShiftToDB,
  setShiftUnderMouse
}

const mapStateToProps = (state: Store, ow: OwnProps): MSProps => ({
  currentUser: getCurrentUser(state),
  shifts: state.roster.shiftWeek,
  focusedShiftRef: state.ui.roster.shiftBoard.focusedShiftRef,
  shiftUnderMouse: state.ui.roster.shiftBoard.shiftUnderMouse
})

export default connect(mapStateToProps, actionsToProps)(WithMouseLogic)
