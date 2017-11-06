//@flow
import React, { PureComponent } from 'react'
import type { PreShift } from 'types/index'

import DisplayShiftBox from './displayShiftBox'
import ModifyShiftBox from './modifyShiftBox'

import './styles.css'

type Props = {
  shift: PreShift,
  focused: boolean,
  inCreation?: boolean,
  templateMode?: boolean,
}

export default class ShiftBox extends PureComponent{
  props: Props

  render = () => (
    this.props.focused
      ? <ModifyShiftBox { ...this.props } />
      : <DisplayShiftBox { ...this.props } />
  )
}
