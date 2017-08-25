//@flow
import React from 'react'
import { connect } from 'react-redux'

import { unfocusShiftCell } from 'actions/ui/roster'

import AddEditShift from './addEditShift'
import ResolveEdit from './resolveEdit'
import './styles.css'

//import type { ShiftCell, Shift, ShiftEdit, User, Note } from 'types/index'

const CellPopover = (props: any) => {
  const hasEdit = props.cell && props.cell.hasEdit

  //return <ResolveEdit { ...props } />
  if(hasEdit) return <ResolveEdit { ...props } />
  return <AddEditShift { ...props } />
}





const actionsToProps = {
  unfocusShiftCell
}

const mapStateToProps = (state) => ({

})

export default connect(mapStateToProps, actionsToProps)(CellPopover)
