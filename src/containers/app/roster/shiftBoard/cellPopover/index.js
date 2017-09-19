//@flow
import React from 'react'
import { connect } from 'react-redux'

import getCurrentUser from 'selectors/currentUser'

import GrabOpenShift from './grabOpenShift'
import AddEditShift from './addEditShift'
import ResolveEdit from './resolveEdit'
import './styles.css'

import type { ShiftCell, User } from 'types/index'

type Props = {
  focusedCell: ShiftCell,
  currentUser: User,
}

const CellPopover = (props: Props) => {
  // const hasEdit = props.focusedCell.hasEdit
  // const isOpen  = props.focusedCell.isOpen
  //const isAdmin = props.currentUser.isAdmin

  // if(isOpen && !isAdmin) return <GrabOpenShift />
  // if(hasEdit) return <ResolveEdit />
  return <AddEditShift />
}

const mapStateToProps = (state) => ({
  currentUser: getCurrentUser(state)
})

export default connect(mapStateToProps)(CellPopover)
