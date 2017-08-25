//@flow

import React from 'react'
import { connect } from 'react-redux'

import { unfocusShiftCell } from 'actions/ui/roster'

import AddEditShift from './addEditShift'
import './styles.css'

type Props = {
  unfocusShiftCell: ()=>void
}

const CellPopover = (props: Props) => {

  return(
    <AddEditShift { ...props } />
  )
}

const actionsToProps = {
  unfocusShiftCell
}

const mapStateToProps = (state) => ({

})

export default connect(mapStateToProps, actionsToProps)(CellPopover)
