//@flow
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'

import { focusShiftCell } from 'actions/ui/roster'
import { getShiftOfCell, getShiftsOfUser, getNotesOfUser, getShadowedDay } from './localHelpers'
import { openNotesModal } from 'actions/ui'
import { generateGuid } from 'helpers/general'
import { weekDays } from 'constants/roster'

import UserRow from './userRow'
import OpenShifts from './openShifts'
import CellPopover from './cellPopover'
import getFocusedShift from 'selectors/focusedShift'
import withMouseEvents from './withMouseEvents'
import PickedUpCell from './pickedUpCell'
import './styles.css'

import type { User, Shift, Shifts, ShiftCell, Note } from 'types/index'
import type { NoteModalProps } from 'actions/ui/modals'

export type Props = {
  users: [User],
  shifts: Shifts,
  notes: Array<Note>,
  focusedCell: ShiftCell,
  focusedShift: Shift,
  optionsExpanded: boolean,
  pickedUpCell: ?ShiftCell, // comes from HOC
  shadowedCell: ?ShiftCell, // comes from HOC
  focusShiftCell: ({}) => void,
  saveShift: (Shift)=> void,
  openNotesModal: (NoteModalProps)=>{},
  getPickedUpCellRef: (HTMLElement)=>void
}

class ShiftBoard extends PureComponent{
  props: Props


  render(){
    const { users, shifts, focusedCell, notes } = this.props
    const { pickedUpCell, shadowedCell, getPickedUpCellRef } = this.props
    return(
      <fb id="shiftBoardMain">
        {/* <OpenShifts
          shifts={shifts.filter(s => s.isOpen)}
          notes={notes}
          shadowedCell={shadowedCell}
          highlightedCell={null} /> */}
        <fb className='assignedShifts'>
          { users.map(user => {
            //const highlightedDay =  focusedCell && focusedCell.user === user.id && focusedCell.day
            return <UserRow
              key={user.id}
              user={user}
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
  focusedCell: state.ui.roster.weekPlan.focusedCell,
  notes: state.roster.notes,
  shifts: state.roster.shiftWeek,
  focusedShift: getFocusedShift(state),
})

export default connect(mapStateToProps, actionsToProps)(withMouseEvents(ShiftBoard))
