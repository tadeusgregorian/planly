// @flow
import React, { PureComponent } from 'react'
import WeekPlan from './weekPlan'
import SubBar from './subBar'
import './styles.css'


export default class Roster extends PureComponent {

  render() {
    return(
      <fb className="rosterMain">
        <SubBar />
        <WeekPlan />
      </fb>
    )
  }
}
