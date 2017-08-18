//@flow
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import type { userType, Shift, MinimalShift, Shifts, FocusedCell, Note } from 'types/index'
import getFocusedShift from 'selectors/focusedShift'
import { toggleOptions } from 'actions/ui/roster'
import UserRow from './userRow'
import CellPopover from './cellPopover'
import './styles.css'

type Props = {
  users: [userType],
  shifts: Shifts,
  notes: Array<Note>,
  focusedCell: FocusedCell,
  focusedShift: Shift,
  optionsExpanded: boolean,
  toggleOptions: ()=>void,
  focusShiftCell: ({}) => void,
  saveShift: (MinimalShift) => void,
  unfocusShiftCell: ()=>void
}

class ShiftBoard extends PureComponent{
  props: Props

  onClick = ({target}: any) => {
    const day     = target.getAttribute('data-day')
    const user    = target.getAttribute('data-user')
    const top     = target.offsetTop
    const left    = target.offsetLeft
    const width   = target.offsetWidth
    const height  = target.offsetHeight
    const isShiftCell = target.getAttribute('data-celltype') === 'shiftcell'

    if(isShiftCell) this.props.focusShiftCell({day, user, top, left, width, height})
  }

  render(){
    const { users, shifts, focusedCell, focusedShift, optionsExpanded, notes } = this.props
    return(
      <fb id="shiftBoardMain" onClick={this.onClick}>
        <fb className='content'>
          { users.map(user => {
            const shiftsOfUser = shifts.filter(s => s.user === user.id)
            const notesOfUser  = notes.filter(n => n.user === user.id)
            const highlightedDay = optionsExpanded && focusedCell && focusedCell.user === user.id && focusedCell.day
            return <UserRow
              key={user.id}
              user={user}
              shifts={shiftsOfUser}
              notes={notesOfUser}
              highlightedDay={highlightedDay}/>
          })}
        </fb>
        { focusedCell &&
          <CellPopover
            cell={focusedCell}
            shift={focusedShift}
            note={notes.find(n => n.user === focusedCell.user && n.day === focusedCell.day )}
            saveShift={this.props.saveShift}
            toggleOptions={this.props.toggleOptions}
            optionsExpanded={optionsExpanded}
            closePopover={this.props.unfocusShiftCell}/>
          }
      </fb>
    )
  }
}

const actionsToProps = {
  toggleOptions
}

const mapStateToProps = (state) => ({
  users: state.core.users,
  focusedShift: getFocusedShift(state),
  optionsExpanded: state.ui.roster.weekPlan.optionsExpanded,
})

export default connect(mapStateToProps, actionsToProps)(ShiftBoard)
