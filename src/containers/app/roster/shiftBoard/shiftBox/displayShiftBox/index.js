//@flow
import React, { PureComponent } from 'react'
import { shiftToString } from 'helpers/index'
import type { Shift, ShiftEdit, Note } from 'types/index'
import './styles.css'

type Props = {
  shift: Shift,
  shiftEdit?: ShiftEdit,
  note: ?Note,
}

export default class DisplayShiftBox extends PureComponent{
  props: Props

  render(){
    const { shift, shiftEdit, note } = this.props
    const { day, user, id } = shift
    const hasEdit = shiftEdit ? 'true' : ''
    // const posBoxStyle = position && {
    //   color: position.color,
    //   backgroundColor: shadeColor(position.color, 0.8)
    // }

    return(
      <fb className='displayShiftBoxMain' data-target-type='shift' data-day={day} data-user={user} data-shift-id={id} data-has-edit={hasEdit} >
        {/* { position && <fb className='posBox' style={posBoxStyle}>{position.name}</fb> } */}
        <fb className='shiftTimesWrapper'>
          <fb className='shiftTimes'>{shiftToString(shift)}</fb>
          { !!shift.b && <fb className='breakTime'>{'/ ' + shift.b}</fb> }
        </fb>
        { shiftEdit && <fb className='edited icon icon-pen'>edited...</fb> }
        <fb className='footer'>
          { note  && <icon className='icon icon-comment hasNoteCellIcon' data-day={day} data-user={user} data-target-type='noteicon' />}
        </fb>
      </fb>
    )
  }
}
