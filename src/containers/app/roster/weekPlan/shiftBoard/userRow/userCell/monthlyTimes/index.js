//@fow
import React, { PureComponent } from 'react'
import { db } from 'actions/firebaseInit'
import { getFBPath } from 'actions/actionHelpers'
import { connect } from 'react-redux'
import type { Connector } from 'react-redux'
import type { User, Store } from 'types/index'
import { weekIDToMoment } from 'helpers/roster';
import { minToTimeString } from 'helpers/roster'
import {momToSmart} from 'helpers/index';
import {getWeekDaysInMonth} from './localHelpers';
import './styles.css'

type Props = {
  user: User,
  currentWeekID: string
}

class MonthlyTimes extends PureComponent {
  constructor(props){
    super(props)

    this.shiftsListener = null
    this.extraHoursListener = null
    this.absencesListener = null

    this.shiftsLoading = false
    this.extraHoursLoading = false
    this.absencesLoading = false

    this.sum = 0

    this.shiftsList = []
    this.extraHoursList = []
    this.absencesList = []

    this.state = {
      sum: 0,
      loading: false
    }
  }

  absenceIncludesDate = (absence, checkDate) => checkDate >= absence.startDate && checkDate <= absence.endDate
  isAcceptedVac = (abs) => abs.status === 'accepted' && abs.type === 'vac'
  allLoaded = () => !this.shLoading && !this.exLoading && !this.abLoading

  getShiftsRef = (monthID, userID) =>
    db().ref(getFBPath('shiftsPM', [monthID])).orderByChild('user').equalTo(userID)

  getExtraHoursRef = (monthID, userID) =>
    db().ref(getFBPath('extraHoursPM', [monthID])).orderByChild('user').equalTo(userID)

  getAbsencesRef = (year, userID) =>
    db().ref(getFBPath('absences')).orderByChild('yearUser').equalTo(year + userID)

  updateSum = () => {
    let sum = 0

    if(this.allLoaded()){

      const vacationsList = this.absencesList.filter(a => this.isAcceptedVac(a))

      // adding Shifts to sum ( excluding shifts in vac )
      this.shiftsList.forEach(s => {
        let shiftIsInVac = false
        vacationsList.forEach(a => this.absenceIncludesDate(a, s.date) && (shiftIsInVac = true))
        !shiftIsInVac && (sum += s.mins)
      })

      // adding vacDays to sum ( excluding non workingDays )
      const mom = weekIDToMoment(this.props.currentWeekID)
      const WeekDaysInMonth = getWeekDaysInMonth(mom.year(), mom.month()) // returns for example ['we', 'th', 'fr' ...] for the whole month starting with the 1. day in month
      const firstOfMonthSmart = momToSmart(mom.date(1))

      WeekDaysInMonth.forEach((wd, i) => {
        const curSmartDate = firstOfMonthSmart + i
        vacationsList.forEach(v => {
          this.absenceIncludesDate(v, curSmartDate) && v.workDays[wd] && (sum += v.avgMins)
        })
      })

      // adding extraHours to sum
      this.extraHoursList.forEach(e => sum+= e.mins)
    }

    this.allLoaded() && this.setState({ sum: sum, loading: false })
    !this.allLoaded() && !this.state.loading && this.setState({ loading: true })
  }

  setListener = (target, ref) => {
    this[target + 'Loading'] = true
    this[target + 'Listener'] = ref.on('value', (snap) => {
      this[target + 'Loading'] = false
      this[target + 'List'] = Object.values(snap.val() || {})

      this.updateSum()
    })
  }

  componentDidMount () {
    const mom = weekIDToMoment(this.props.currentWeekID)
    const monthID = mom.format('YYYYMM')
    const year = mom.year().toString()
    const userID = this.props.user.id
    this.setListener('shifts', this.getShiftsRef(monthID, userID))
    this.setListener('extraHours', this.getExtraHoursRef(monthID, userID))
    this.setListener('absences', this.getAbsencesRef(year, userID))
  }

  componentDidUpdate(prevProps) {
    const userID = this.props.user.id
    const prevMom = weekIDToMoment(prevProps.currentWeekID)
    const curMom = weekIDToMoment(this.props.currentWeekID)

    const yearChanged = prevMom.year() !== curMom.year()
    const monthChanged = prevMom.month() !== curMom.month()

    if(monthChanged){
      this.removeShiftsListener(prevMom.format('YYYYMM'))
      this.removeExtraHoursListener(prevMom.format('YYYYMM'))
      this.setListener('shifts', this.getShiftsRef(curMom.format('YYYYMM'), userID))
      this.setListener('extraHours', this.getExtraHoursRef(curMom.format('YYYYMM'), userID))
    }

    if(yearChanged){
      this.removeAbsencesListener()
      this.setListener('absences', this.getAbsencesRef(curMom.year().toString(), userID))
    }
  }

  componentWillUnmount() {
    const monthID = weekIDToMoment(this.props.currentWeekID).format('YYYYMM')
    this.removeShiftsListener(monthID)
    this.removeExtraHoursListener(monthID)
    this.removeAbsencesListener()
  }

  removeShiftsListener     = (monthID) => db().ref(getFBPath('shiftsPM', [monthID])).off('value', this.shiftsListener)
  removeExtraHoursListener = (monthID) => db().ref(getFBPath('extraHoursPM', [monthID])).off('value', this.extraHoursListener)
  removeAbsencesListener   = ()        => db().ref(getFBPath('absences')).off('value', this.absencesListener);

  render() {
    const { sum, loading } = this.state
    const { user, currentWeekID } = this.props

    const monthlyMins = Object.values(user.monthlyMins)[0]
    const monthlyHours = Math.round((monthlyMins / 60) * 100) / 100
    const month = weekIDToMoment(currentWeekID).format('MMM').toUpperCase().substr(0,3)
    const sumTime = minToTimeString(sum)


    return (
      <fb className='monthlyTimesMain'>
        <fb className='month'>{month}</fb>
        <fb className='istTime'>{ loading ? '...' : sumTime }</fb>
        <fb className='sollTime'>{' / ' +  monthlyHours + ' h'}</fb>
      </fb>
    )
  }
}

const mapStateToProps = (state: Store) => ({

})

const connector: Connector<OwnProps, Props> = connect(mapStateToProps)
export default connector(MonthlyTimes)
