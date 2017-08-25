//@flow
import React from 'react'
import { connect } from 'react-redux'

import { unfocusShiftCell } from 'actions/ui/roster'

import AddEditShift from './addEditShift'
import ResolveEdit from './resolveEdit'
import './styles.css'

import type { User, ShiftCell } from 'types/index'

type Props = {
  unfocusShiftCell: ()=>void,
  currentUser: User,
  cell: ShiftCell,
}

const CellPopover = (props: Props) => {
  const { cell } = props

  if(cell.hasEdit) return <ResolveEdit { ...props } />
  return <AddEditShift { ...props } />
}

const actionsToProps = {
  unfocusShiftCell
}

const mapStateToProps = (state) => ({

})

export default connect(mapStateToProps, actionsToProps)(CellPopover)
