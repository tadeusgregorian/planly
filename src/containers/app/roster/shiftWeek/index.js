// @flow
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import ShiftBoard from './shiftBoard'
import ActionBar from './actionBar'
import { setShiftWeekListener } from 'actions/listeners'
import './styles.css'

class ShiftWeek extends PureComponent{

  componentDidMount = () => {
    this.props.setShiftWeekListener()
  }

  render(){
    return(
      <fb className="shiftWeekWrapper">
        <fb className='shiftWeekMain'>
          <ActionBar />
          <ShiftBoard shifts={this.props.shiftWeek} />
        </fb>
      </fb>
    )
  }
}

const actionsToProps = {
  setShiftWeekListener
}

const mapStateToProps = (state) => ({
  shiftWeek: state.roster.shiftWeek,
  shiftWeekDataStatus: state.roster.shiftWeekDataStatus,
})

export default connect(mapStateToProps, actionsToProps)(ShiftWeek)
