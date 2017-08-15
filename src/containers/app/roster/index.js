// @flow
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import WeekPlan from './weekPlan'
import SubBar from './subBar'
import './styles.css'


class Roster extends PureComponent {

  render() {
    return(
      <fb className="rosterMain">
        <SubBar />
        <WeekPlan />
      </fb>
    )
  }
}

const mapStateToProps = (state) => ({
  users: state.core.usuers
})

export default connect(mapStateToProps)(Roster)
