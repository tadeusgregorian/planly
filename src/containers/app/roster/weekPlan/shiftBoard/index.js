//@flow
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import type { userType, Shift, MinimalShift, Shifts, FocusedCell } from 'types/index'
import getFocusedShift from 'selectors/focusedShift'
import UserRow from './userRow'
import CellPopover from './cellPopover'
import './styles.css'

class ShiftBoard extends PureComponent{
  props: {
    users: [userType],
    shifts: Shifts,
    focusedCell: FocusedCell,
    focusedShift: Shift,
    focusShiftCell: ({}) => void,
    saveShift: (MinimalShift) => void,
    unfocusShiftCell: ()=>void
  }

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
    const { users, shifts, focusedCell, focusedShift } = this.props
    return(
      <fb className="shiftBoardMain" onClick={this.onClick}>
        <fb className='content'>
          { users.map(user =>
            <UserRow user={user} key={user.id} shifts={shifts.filter(s => s.user === user.id)}/>
          )}
        </fb>
        { focusedCell &&
          <CellPopover
            cell={focusedCell}
            shift={focusedShift}
            saveShift={this.props.saveShift}
            closePopover={this.props.unfocusShiftCell}/>
          }
      </fb>
    )
  }
}

const mapStateToProps = (state) => ({
  users: state.core.users,
  focusedShift: getFocusedShift(state)
})

export default connect(mapStateToProps)(ShiftBoard)
