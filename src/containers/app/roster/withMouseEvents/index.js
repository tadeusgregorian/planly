//@flow
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'

import { openNotesModal }           from 'actions/ui/modals'
import { focusShift, createShift }  from 'actions/ui/roster'
import { saveShiftToDB }            from 'actions/roster'

import { getParentShift, getParentCell } from './localHelpers'
import { generateGuid } from 'helpers/index'
import getCurrentUser from 'selectors/currentUser'

import PickedUpShift from './pickedUpShift'

import type { User, ShiftCell, ShiftRef, Shift, Shifts, Store } from 'types/index'

type MSProps = {
  currentUser: User,
  shifts: Shifts,
}

type MAProps = {
  openNotesModal: (any)=>any,
  focusShift: (ShiftRef)=>any,
  createShift: (ShiftCell)=>any,
  saveShiftToDB: (Shift)=>any
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

  isAdmin: boolean
  mouseIsDown: boolean
  isDragging: boolean
  mousePosStart: {x: number, y: number}
  mousePosDelta: {x: number, y: number}
  PickedUpElement: ?HTMLElement

  constructor(props: Props){
    super(props)

    this.mouseIsDown = false
    this.isAdmin = !!(this.props.currentUser && this.props.currentUser.isAdmin)
    this.state = {
      pickedUpShift: null,
      shadowedCell: null
    }
  }

  componentDidMount = () => {
    console.log(this.isAdmin);
    document.addEventListener('click',   this.onClick)
    if(this.isAdmin){ // only admin has drag and drop
      document.addEventListener('mousemove', this.onMouseMove)
      document.addEventListener('mouseover', this.onMouseOver)
      document.addEventListener('mousedown', this.onMouseDown)
      document.addEventListener('mouseup',   this.onMouseUp)
    }
  }

  componentWillUnmount = () => {
    document.removeEventListener('click',   this.onClick)
    if(this.isAdmin){ // only admin has drag and drop
      document.removeEventListener('mouseover', this.onMouseOver)
      document.removeEventListener('mousemove', this.onMouseMove)
      document.removeEventListener('mousedown', this.onMouseDown)
      document.removeEventListener('mouseup',   this.onMouseUp)
    }
  }

  onMouseOver = ({target}: any) => {
    if(!this.mouseIsDown) return
    const cellUnderMouse = getParentCell(target)
    //dont allow to shadow Cells that already have a shift.
    const isCellAndEmpty = cellUnderMouse && !cellUnderMouse.hasShift
    const shadowedCell = isCellAndEmpty ? cellUnderMouse : null

    this.setState({shadowedCell: shadowedCell})
  }

  onMouseDown = (e: any) => {
    const pressedShift = getParentShift(e.target)
    if (!pressedShift) return
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
    if(!this.isDragging){

      const targetShift = getParentShift(target)
      const targetCell = getParentCell(target)

      if(targetShift) return this.props.focusShift(targetShift)
      if(targetCell)  return this.props.createShift(targetCell)

      // elementIsShiftCell(target) && this.props.focusShiftCell(shiftCell)
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
  openNotesModal,
  focusShift,
  createShift,
  saveShiftToDB
}

const mapStateToProps = (state: Store, ow: OwnProps): MSProps => ({
  currentUser: getCurrentUser(state),
  shifts: state.roster.shiftWeek
})

export default connect(mapStateToProps, actionsToProps)(WithMouseLogic)
