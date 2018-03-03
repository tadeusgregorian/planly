//@flow
import React, { PureComponent } from 'react'
import cn from 'classnames'
import { connect } from 'react-redux'
import type { Connector } from 'react-redux'
import values from 'lodash/values'

import ShiftTimesBar from '../components/shiftTimesBar'
import LocationBar   from '../components/locationBar'
import PositionBar   from '../components/positionBar'
import OverlapIcon   from '../components/overlapIcon'

import type { Branch, PreShift, Location, Store, Position } from 'types/index'
import './styles.css'

type ConProps = {
  branch: ?Branch,
  positions: Array<Position>
}

type OwnProps = {
  shift: PreShift,
  templateMode?: boolean,
  overlaps?: ?string,
}

type Props = OwnProps & ConProps

class DisplayShiftBox extends PureComponent{
  props: Props

  render(){
    const { shift, branch, positions, templateMode, overlaps } = this.props
    const { day, user, id, note, edit, location, position } = shift

    const locations: Array<Location> = (branch && branch.locations && values(branch.locations)) || []

    return(
      <fb className={cn({displayShiftBoxMain: 1, temp: templateMode})}
        data-target-type='shift'
        data-day={day}
        data-user={user}
        data-shift-id={id}
        data-has-edit={!!edit || null} // when an attr is null -> it gets omitted by react
        data-pos={position || null}
      >
        { note && <fb className='noteIcon icon icon-comment' /> }
        { overlaps && <OverlapIcon branchName={overlaps} /> }
        <ShiftTimesBar shift={shift} />
        { edit && <fb className='bigRoundEdit icon icon-pen'/> }
        { location && <LocationBar locations={locations} location={location} /> }
        { position && <PositionBar positions={positions} position={position} /> }
      </fb>
    )
  }
}

const mapStateToProps = (state: Store) => ({
  branch: state.core.branches.find(b => b.id === state.ui.roster.currentBranch),
  positions: state.core.positions,
})

const connector: Connector<OwnProps, Props> = connect(mapStateToProps)
export default connector(DisplayShiftBox)
