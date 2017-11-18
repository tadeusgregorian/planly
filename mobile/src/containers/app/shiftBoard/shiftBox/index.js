//@flow
import React from 'react'
import cn from 'classnames'
import { connect } from 'react-redux'
import type { Connector } from 'react-redux'
import { shiftToString } from 'helpers/roster'
import type { Store, Shift, User, Branch, PlanMode } from 'types/index'
import './styles.css'

type OwnProps = {
  shift: Shift
}

type ConProps = {
  users: Array<User>,
  branches: Array<Branch>,
  planMode: PlanMode,
}

type Props = OwnProps & ConProps

const shiftBox = (props: Props) => {
  const { shift, users, branches, planMode } = props
  const userObj:?User           = (users.find( u => u.id === shift.user): any)
  const branchObj: Branch       = (branches.find( b => b.id === shift.branch): any)

  const note      = !!shift.note
  const openShift = shift.user === 'open'
  let   userName  = userObj ? userObj.name : ''
  if(openShift) userName = 'Offene Schicht'

  const locID       = shift.location
  const locations   = branchObj.locations
  const locObj      = locID && locations && locations[locID]

  const multiBranch  = userObj && Object.keys(userObj.branches).length > 1
  const inTeamMode   = planMode === 'TEAM'
  const inPersMode   = planMode === 'PERSONAL'

  return(
    <fb className={cn({shiftBoxMain: 1, open: openShift})}>
      <fb className='row'>
        <fb className='shiftTimes' >{ shiftToString(shift) }</fb>
        { !!shift.b && <fb className='breakMins'>{'/' + shift.b + ' min'}</fb> }
      </fb>
      <fb className='row secondRow'>
        { inTeamMode  && <fb className='userName'>{ userName }</fb> }
        { inPersMode  && multiBranch && <fb className='branchName'>{ branchObj.name }</fb> }
        { locObj      && <fb className='location' style={{color: locObj.color}}>{locObj.name}</fb> }
        { note        && <fb className='note icon icon-messages'></fb> }
      </fb>
    </fb>
  )
}

const mapStateToProps = (state: Store) => ({
  users: state.core.users,
  branches: state.core.branches,
  planMode: state.ui.roster.planMode,
})

const connector: Connector<OwnProps, Props> = connect(mapStateToProps)
export default connector(shiftBox)
