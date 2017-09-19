//@flow
import React, { PureComponent } from 'react'
import type { Shift, Note, Position, ShiftEdit, ShiftRef } from 'types/index'
import { shiftCellWidth, shiftCellHeight } from 'constants/roster'
import ShiftBox from '../../shiftBox'
import cn from 'classnames'
import './styles.css'

type Props = {
  day: string,
  user: string,
  focusedShiftRef: ?ShiftRef,
  highlighted?: boolean,
  shadowed?: boolean,
  note?: Note,
  shift?: Shift,
  shiftEdit?: ShiftEdit,
  position?: Position, // for open Shifts only
  shiftType: 'openshift' | 'usershift',
  style?: {},
  cssClasses?: Array<string>,
  blocked?: ?boolean, // indicates if the currentUser has permission to focus this cell.
}

export default class ShiftCell extends PureComponent {
  props: Props

  render(){
    const { shift, day, user, highlighted, note, shadowed, shiftType, style, cssClasses, position, blocked, shiftEdit, focusedShiftRef } = this.props
    const cssClassesObj = cssClasses ? cssClasses.reduce((acc, val) => ({ ...acc, [val]: true }), {}) : {} // turnes the classesArray to an obj for classnames
    const focused = !!(shift && focusedShiftRef && focusedShiftRef.id === shift.id)

    return(
      <fb className={cn({shiftCellMain: true, highlighted, shadowed, ...cssClassesObj })}
        data-target-type='shiftcell'
        data-day={day}
        data-user={user}
        data-shift-type={shiftType ? shiftType : ''}
        data-clickable={blocked ? 'blocked' : 'true'}
        data-has-shift={shift ? 'true' : ''}
        style={{width: shiftCellWidth, height: shiftCellHeight, ...style}}
      >
        { shift && <ShiftBox shift={shift} note={note} shiftEdit={shiftEdit} focused={focused} /> }
      </fb>
    )
  }
}
