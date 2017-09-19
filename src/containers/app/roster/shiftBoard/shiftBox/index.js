//@flow
import React, { PureComponent } from 'react'
import type { Shift, ShiftEdit, Note } from 'types/index'

import DisplayShiftBox from './displayShiftBox'
import ModifyShiftBox from './modifyShiftBox'

import './styles.css'

type Props = {
  shift: Shift,
  shiftEdit?: ShiftEdit,
  note: ?Note,
  focused: boolean
}

export default class ShiftBox extends PureComponent{
  props: Props

  render = () => (
    this.props.focused
      ? <ModifyShiftBox { ...this.props } />
      : <DisplayShiftBox { ...this.props } />
  )
}
