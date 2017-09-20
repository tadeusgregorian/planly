//@flow
import React, { PureComponent } from 'react'
import type { Shift, ShiftEdit } from 'types/index'

import DisplayShiftBox from './displayShiftBox'
import ModifyShiftBox from './modifyShiftBox'

import './styles.css'

type Props = {
  shift: Shift,
  shiftEdit?: ShiftEdit,
  focused: boolean,
  inCreation?: boolean,
  isHovered?: boolean,
}

export default class ShiftBox extends PureComponent{
  props: Props

  render = () => (
    this.props.focused
      ? <ModifyShiftBox { ...this.props } />
      : <DisplayShiftBox { ...this.props } />
  )
}