//@fow
import React, { PureComponent } from 'react'
import cn from 'classnames'
import moment from 'moment'
import { db } from 'actions/firebaseInit'
import { getFBPath } from 'actions/actionHelpers'
import { connect } from 'react-redux'
import type { Connector } from 'react-redux'
import type { User, Store } from 'types/index'
import { weekIDToMoment } from 'helpers/roster';
import './styles.css'



type Props = {
  user: User,
  currentWeekID: string
}

class MonthlyTimes extends PureComponent {
  constructor(props){
    super(props)

    this.shiftsRef = null
    this.extraHoursRef = null
    this.absencesRef = null
  }

  setShiftsListeners = () => {
    //const momthID = weekIDToMoment(this.props.currentWeekID).weekday(0).year()
    //db().ref(getFBPath('shiftsPM', [tempID])).once('value')
    console.log('GoGo')
  }

  componentDidMount () {
    const mom = weekIDToMoment(this.props.currentWeekID)
    this.setListeners()
  }

  componentDidUpdate(prevProps, prevState) {
    const prevMom = weekIDToMoment(prevProps.currentWeekID)
    const curMom = weekIDToMoment(this.props.currentWeekID)
    const monthChanged = prevMom.month() !== curMom.month()
    const yearChanged = prevMom.year() !== curMom.year()
    console.log(yearChanged)
  }

  render() {

    const monthlyMins = Object.values(this.props.user.monthlyMins)[0]
    const monthlyHours = Math.round((monthlyMins / 60) * 100) / 100

    return (
      <fb className='monthlyTimesMain'>
        {monthlyHours}
      </fb>
    )
  }
}

const mapStateToProps = (state: Store) => ({

})

const connector: Connector<OwnProps, Props> = connect(mapStateToProps)
export default connector(MonthlyTimes)
