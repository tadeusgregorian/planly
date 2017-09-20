//@flow
import React, { PureComponent } from 'react'
import type { Shifts, Position, ShiftEdit, ShiftRef } from 'types/index'
import { shiftCellWidth } from 'constants/roster'
import ShiftBox from '../../shiftBox'
import cn from 'classnames'
import './styles.css'

type Props = {
  day: string,
  user: string,
  focusedShiftRef: ?ShiftRef,
  shiftUnderMouse: ?ShiftRef,
  highlighted?: boolean,
  shadowed?: boolean,
  shifts: Shifts,
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
    const { shifts, day, user, highlighted, shadowed, shiftType, style, cssClasses, blocked, shiftEdit, focusedShiftRef, shiftUnderMouse } = this.props
    const cssClassesObj = cssClasses ? cssClasses.reduce((acc, val) => ({ ...acc, [val]: true }), {}) : {} // turnes the classesArray to an obj for classnames
    const inCreation      = focusedShiftRef && focusedShiftRef.inCreation
    const dummyShift:any  = inCreation && focusedShiftRef && { s: 0, e: 0, b: 0, user, day, id: focusedShiftRef.id }

    return(
      <fb className={cn({shiftCellMain: true, highlighted, shadowed, ...cssClassesObj })}
        data-target-type='shiftcell'
        data-day={day}
        data-user={user}
        data-shift-type={shiftType ? shiftType : ''}
        data-clickable={blocked ? 'blocked' : 'true'}
        data-has-shift={(shifts.length || inCreation ) ? 'true' : ''}
        data-has-focus={focusedShiftRef ? 'true' : ''}
        style={{width: shiftCellWidth, ...style}}
      >
        { shifts.map((shift, i) =>
            <ShiftBox
              shift={shift}
              shiftEdit={shiftEdit}
              focused={!!focusedShiftRef && focusedShiftRef.id === shift.id}
              isHovered={!!shiftUnderMouse && shiftUnderMouse.id === shift.id && !focusedShiftRef && i === shifts.length - 1}  />
          )
        }
        { inCreation && <ShiftBox shift={dummyShift} focused inCreation/> }
      </fb>
    )
  }
}
