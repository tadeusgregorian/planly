//@flow
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { shiftCellWidth } from 'constants/roster'
import type { Notes, Shifts, Position, User } from 'types/index'
import { shiftToMinimalShift, generateGuid } from 'helpers/index'
import getCurrentUser from 'selectors/currentUser'
import ShiftCell from '../../shiftCell'
import './styles.css'

type Props = {
  day: string,
  shifts: Shifts,
  notes: Notes,
  positions: Array<Position>,
  currentUser: User
}

class DayColumn extends PureComponent<void, Props, void>{
  generatedUID: string

  componentDidMount = () => { this.generatedUID = generateGuid() }

  componentWillReceiveProps = (nP: Props) => {
    if(this.props.shifts.length !== nP.shifts.length){
      this.generatedUID = generateGuid()
    }
  }

  render(){
    const { shifts, day, notes, positions, currentUser } = this.props
    const { isAdmin } = currentUser

    return(
      <fb className="openShiftsDayColumnMain" style={{width: shiftCellWidth}}>
        { shifts.map(shift => {
            const minimalShift  = shift && shiftToMinimalShift(shift)
            return <ShiftCell
                key={shift.user}
                user={shift.user}
                shift={minimalShift}
                day={day}
                position={positions.find(p => p.id === shift.position)}
                note={notes.find(n => n.user === shift.user)}
                shiftType='openshift'
              />
          })
        }
        { <ShiftCell
          user={this.generatedUID}
          day={day}
          note={notes.find(n => n.user === this.generatedUID)}
          shiftType='openshift'
          cssClasses={['openShiftInputCell', (isAdmin ? 'admin' : '')]}
        /> }
        {/*  This Dummy Cell is just filling the empty column to a min of 1 */}
        {/* { !currentUser.isAdmin && !shifts.length && <fb className='dummyCell openShiftInputCell'
          ></fb>
        } */}
      </fb>
    )
  }
}

const mapStateToProps = (state) => ({
  currentUser: getCurrentUser(state)
})

export default connect(mapStateToProps)(DayColumn)
