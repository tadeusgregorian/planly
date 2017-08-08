import React, { PureComponent } from 'react'
import FlatInput from 'components/flatInput'
import _ from 'lodash'
import moment from 'moment'
import { withoutProp } from 'helpers'
import DatePicker from 'react-datepicker';
import cn from 'classnames'
import 'react-datepicker/dist/react-datepicker.css';
import './styles.css'

export default class WeeklyHoursInput extends PureComponent {
  constructor(props){
    super(props)

    this.state = { extendButtonVisible: false }
  }

  isMultirow = () => _.keys(this.props.weeklyHours).length > 1
  datesAsArray = () => _.keys(this.props.weeklyHours).sort((a, b) => a - b )
  dateBeforeLast = () => this.datesAsArray()[this.datesAsArray().length - 2]
  latestCreatedDate = () => _.max(this.datesAsArray())

  mouseOver = () => this.setState({ extendButtonVisible: true })
  mouseOut = () => this.setState({ extendButtonVisible: false })

  extendWeeklyHours = (extension) => this.props.setWeeklyHours({ ...this.props.weeklyHours, ...extension })
  addNewRow = () => this.extendWeeklyHours({[this.nextAvailableDate()]: ''})
  deleteLastEntry = () => this.props.setWeeklyHours(withoutProp(this.props.weeklyHours, this.latestCreatedDate()))
  replaceLastDate = (newDate, newValue) => {
    const withoutLast = withoutProp(this.props.weeklyHours, this.latestCreatedDate())
    this.props.setWeeklyHours({ ...withoutLast, [newDate]: newValue })
  }

  dateAllowed = (date) => {
    if(date.weekday() !== 0) return false
    if(date.diff(this.dateBeforeLast(), 'days') <= 6) return false
    return true
  }

  nextAvailableDate = () => {
    const sevenDaysAfterLatest = moment(this.latestCreatedDate(), 'YYYYMMDD').add(7, 'days').format('YYYYMMDD')
    const thisMonday = moment().startOf('isoWeek').format('YYYYMMDD')
    return Math.max(parseInt(thisMonday, 10), parseInt(sevenDaysAfterLatest, 10))
  }

  renderExtendButton = () => (
    <fb className="extendButton lightButton" onClick={this.addNewRow}>
      <icon className='icon icon-arrow_drop_down' />
      <fb className="text">erweitern</fb>
    </fb>
  )

  renderRemoveButton = () => (
    <icon className='removeButton icon-delete lightButton' onClick={this.deleteLastEntry}/>
  )

  renderSinglerow = () => {
    const { setWeeklyHours, weeklyHours } = this.props
    const startDate = _.keys(weeklyHours)[0]
    const startWeeklyHours = _.values(weeklyHours)[0]
    return(
      <fb className="inputWrapper">
        <FlatInput value={startWeeklyHours} onInputChange={(inp) => setWeeklyHours({[startDate]: inp})} defaultText='z.B. 40'/>
      </fb>
    )
  }

  renderMultirow = () => {
    const { weeklyHours } = this.props
    return(
      <fb className='inputWrapper'>
        { _.keys(weeklyHours).map((date, i) => (
          <fb className='weeklyHoursRow' key={date}>
            <fb className='dateInfo' >
              <fb className='dateInfoText'>ab dem</fb>
              <fb className='datePickerWrapper'>
                <DatePicker
                  selected={moment(date, 'YYYYMMDD')}
                  onChange={(newDate) => this.replaceLastDate(moment(newDate).format('YYYYMMDD'), weeklyHours[date])}
                  filterDate={this.dateAllowed}
                  disabled={(date !== this.latestCreatedDate())}
                  className={cn({datePicker: true, active: date === this.latestCreatedDate()})}
                />
              </fb>
            </fb>
            <FlatInput
              value={weeklyHours[date]}
              onInputChange={(inp) => this.extendWeeklyHours({[date]: inp})}
              autoFocus={(date === this.latestCreatedDate() && this.state.extendButtonVisible)}
            />
          </fb>
        )) }
      </fb>
    )
  }

  render = () => {
    return(
      <fb className="weeklyHoursInputMain" onMouseEnter={this.mouseOver} onMouseLeave={this.mouseOut}>
        { this.isMultirow() ? this.renderMultirow() : this.renderSinglerow() }
        <fb className='actionButtons'>
          {/* { this.renderRemoveButton() }
          { this.renderExtendButton() } */}
          { this.isMultirow() && this.state.extendButtonVisible && this.renderRemoveButton() }
          { this.props.extendable && this.state.extendButtonVisible && this.renderExtendButton() }
        </fb>
      </fb>
    )
  }
}
