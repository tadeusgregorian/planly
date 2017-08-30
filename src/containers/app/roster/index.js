// @flow
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
//import { Route, withRouter } from 'react-router-dom'
import WeekPlan from './weekPlan'
import SubBar from './subBar'
//import Templates from './templates'
import './styles.css'


class Roster extends PureComponent {

  render() {
    return(
      <fb className="rosterMain">
        <SubBar />
        <WeekPlan />
        {/* <Route path='/app/dienstplan/wochenplan'  component={WeekPlan} />
        <Route path='/app/dienstplan/vorlagen'    component={Templates} /> */}
      </fb>
    )
  }
}

const mapStateToProps = (state) => ({
  users: state.core.usuers
})

export default connect(mapStateToProps)(Roster)
