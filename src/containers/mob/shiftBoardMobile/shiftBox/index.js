//@flow
import React from 'react'
import cn from 'classnames'
import { connect } from 'react-redux'
import type { Connector } from 'react-redux'
import { shiftToString } from 'helpers/roster'
import type { Store, Shift, User, Branch, PlanMode, MinimalShift } from 'types/index'
import {minToTimeString} from 'helpers/roster';
import './styles.css'

type OwnProps = {
  shift: Shift,
  focused: ?boolean,
  shiftClicked: (id: string)=>any
}

type ConProps = {
  users: Array<User>,
  branches: Array<Branch>,
  planMode: PlanMode,
}

type Props = OwnProps & ConProps

const shiftBox = (props: Props) => {
  const { shift, users, branches, planMode, shiftClicked, focused } = props
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

  const edit:?MinimalShift = (shift.edit: any)
  const original = { s: shift.s, e: shift.e, b: shift.b }
  const sEdited = original.s !== (edit && edit.s)
  const eEdited = original.e !== (edit && edit.e)
  const bEdited = original.b !== (edit && edit.b)


  const renderEditBar = () => { if(edit) return( // if check only for FLOW
    <fb className="shiftEditBarMobile">
      <fb className='startEndTime'>
        <fb className="text">editert: </fb>
        <fb className={cn({time: true, boldStyle: sEdited})}>{minToTimeString(edit.s)}</fb>
        <fb className='seperator'>-</fb>
        <fb className={cn({time: true, boldStyle: eEdited})}>{minToTimeString(edit.e)}</fb>
      </fb>
      { (!!edit.b || bEdited) && <fb className={cn({breakMinutes: true, boldStyle: bEdited})}>{'/ ' + edit.b}</fb>}
    </fb>
  )}

  return(
    <fb className={cn({shiftBoxMainMob: 1, openShift, focused})} onClick={() => shiftClicked(shift.id)} >
      <fb className='row timeRow'>
        <fb className='shiftTimes' >{ shiftToString(shift) }</fb>
        { !!shift.b && <fb className='breakMins'>{'/' + shift.b + ' min'}</fb> }
      </fb>
      { !!edit && renderEditBar() }
      <fb className='row secondRow'>
        { inTeamMode  && <fb className='userName'>{ userName }</fb> }
        { inPersMode  && multiBranch && <fb className='branchName'>{ branchObj.name }</fb> }
        { locObj      && <fb className='location' style={{color: locObj.color}}>{locObj.name}</fb> }
        { note        && <fb className='note icon icon-comment'></fb> }
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
