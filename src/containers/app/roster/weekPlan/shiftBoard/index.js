//@flow
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'

import { focusShiftCell } from 'actions/ui/roster'
import { openNotesModal } from 'actions/ui'
import { getShiftsOfUser, getNotesOfUser, getShadowedDay } from './localHelpers'
import { getShiftOfCell } from 'helpers/index'

import getCurrentUser from 'selectors/currentUser'
import UserRow from './userRow'
import OpenShifts from './openShifts'
import CellPopover from './cellPopover'
import getFocusedShift from 'selectors/focusedShift'
import withMouseEvents from './withMouseEvents'
import PickedUpCell from './pickedUpCell'
import ShiftBoardHead from './shiftBoardHead'
import './styles.css'

import type { User, Shift, Shifts, ShiftCell, Note, Position } from 'types/index'

export type Props = {
  users: Array<User>,
  positions: Array<Position>,
  shifts: Shifts,
  notes: Array<Note>,
  focusedCell: ShiftCell,
  focusedShift: Shift,
  optionsExpanded: boolean,
  pickedUpCell: ?ShiftCell, // comes from HOC
  shadowedCell: ?ShiftCell, // comes from HOC
  currentUser: User,       // used in the HOC
  focusShiftCell: ({}) => void,
  saveShift: (Shift)=> void,
  openNotesModal: (any)=>{},
  getPickedUpCellRef: (HTMLElement)=>void // comes from HOC
}

class ShiftBoard extends PureComponent{
  props: Props

  render(){
    const { users, shifts, focusedCell, notes, positions, currentUser } = this.props
    const { pickedUpCell, shadowedCell, getPickedUpCellRef } = this.props // from HOC
    return(
      <fb id="shiftBoardMain">
        <ShiftBoardHead />
        <OpenShifts
          shifts={shifts.filter(s => s.isOpen)}
          notes={notes}
          currentUser={currentUser}
          positions={positions}
          shadowedCell={shadowedCell}
          highlightedCell={null} />
        <fb className='assignedShifts'>
          { users.map(user => {
            //const highlightedDay =  focusedCell && focusedCell.user === user.id && focusedCell.day
            return <UserRow
              key={user.id}
              user={user}
              currentUser={currentUser}
              shifts={getShiftsOfUser(shifts, user.id)}
              notes={getNotesOfUser(notes, user.id)}
              shadowedDay={getShadowedDay(shadowedCell, user.id)}
              highlightedDay={false}
            />
          })}
        </fb>
        { focusedCell &&
          <CellPopover
            cell={focusedCell}
            shift={this.props.focusedShift}
            note={notes.find(n => n.user === focusedCell.user && n.day === focusedCell.day )}
            openNotesModal={this.props.openNotesModal}
            saveShift={this.props.saveShift}/>
        }
        { pickedUpCell &&
          <PickedUpCell
            getRef={getPickedUpCellRef}
            shift={getShiftOfCell(shifts, pickedUpCell)}
            cell={pickedUpCell} />
        }
      </fb>
    )
  }
}

const actionsToProps = {
  openNotesModal,
  focusShiftCell
}

const mapStateToProps = (state) => ({
  users: state.core.users,
  positions: state.core.positions,
  focusedCell: state.ui.roster.weekPlan.focusedCell,
  notes: state.roster.notes,
  shifts: state.roster.shiftWeek,
  focusedShift: getFocusedShift(state),
  currentUser: getCurrentUser(state)
})

export default connect(mapStateToProps, actionsToProps)(withMouseEvents(ShiftBoard))
