// @flow
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import ShiftWeek from './shiftWeek'
import SubBar from './subBar'
import './styles.css'


class Roster extends PureComponent {

  render() {
    return(
      <fb className="rosterMain">
        <SubBar />
        <ShiftWeek />
      </fb>
    )
  }
}

const mapStateToProps = (state) => ({
  users: state.core.usuers
})

export default connect(mapStateToProps)(Roster)
