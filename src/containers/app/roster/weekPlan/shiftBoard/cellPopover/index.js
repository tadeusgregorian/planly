//@flow
import React from 'react'

import AddEditShift from './addEditShift'
import ResolveEdit from './resolveEdit'
import './styles.css'

import type { ShiftCell, Shift } from 'types/index'

type Props = {
  focusedCell: ShiftCell,
  saveShift: (Shift)=>void
}

const CellPopover = (props: Props) => {
  const hasEdit = props.focusedCell && props.focusedCell.hasEdit
  const { saveShift } = props

  if(hasEdit) return  <ResolveEdit saveShift={saveShift} />
  return              <AddEditShift saveShift={saveShift} />
}

export default CellPopover
