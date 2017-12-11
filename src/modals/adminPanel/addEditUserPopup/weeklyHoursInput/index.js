//@flow
import React, { PureComponent } from 'react'
import FlatInput from 'components/flatInput'
import moment from 'moment'
import omit from 'lodash/omit'
import { beginningOfTime } from 'constants/roster'
import { withoutProp, momToSmartWeek, smartWeekToMom, isFloatStr } from 'helpers/index.js'
import DatePicker from 'react-datepicker';
import cn from 'classnames'
import 'react-datepicker/dist/react-datepicker.css';
import './styles.css'
import max from 'lodash/max'

type Props = {
  weeklyHours: {[smartWeek: string]: string},
  setWeeklyHours: ({})=> any,
  extendable: boolean
}

export default class WeeklyHoursInput extends PureComponent{
  props: Props

  isMultirow =          () => Object.keys(this.props.weeklyHours).length > 1
  smartWeeksArray =     () => Object.keys(this.props.weeklyHours).sort()
  dateBeforeLast =      () => this.smartWeeksArray()[this.smartWeeksArray().length - 2]
  latestCreatedDate =   () => max(this.smartWeeksArray())

  extendWeeklyHours = (extension: {}) => {
    this.props.setWeeklyHours({
      ...this.props.weeklyHours,
      ...extension
    })
  }

  addNewRow = () => {
    this.extendWeeklyHours({
      [this.nextAvailableDate()]: ''
    })
  }

  editLatest = (inp: string) => {
    if(!isFloatStr(inp)) return
    this.props.setWeeklyHours({
      ...this.props.weeklyHours,
      [this.latestCreatedDate()]: inp
    })
  }

  deleteLastEntry = () => {
    const { setWeeklyHours, weeklyHours } = this.props
    setWeeklyHours(omit(weeklyHours, [this.latestCreatedDate()] ))
  }

  replaceLastDate = (newDate: string | number, newValue: number | string) => {
    const withoutLast = withoutProp(this.props.weeklyHours, this.latestCreatedDate())
    this.props.setWeeklyHours({ ...withoutLast, [newDate.toString()]: newValue })
  }

  dateAllowed = (date: moment) => {
    if(date.weekday() !== 0) return false
    if(date.diff(smartWeekToMom(this.dateBeforeLast()), 'days') <= 6) return false
    return true
  }

  nextAvailableDate = (): number => {
    const latestMom         = smartWeekToMom(this.latestCreatedDate())
    const nextAvailableWeek = momToSmartWeek(latestMom.add(7, 'days'))
    const currentWeek       = momToSmartWeek(moment())

    return currentWeek <= nextAvailableWeek ? nextAvailableWeek : currentWeek
  }

  renderSinglerow = () => {

    return(
    <fb className="inputWrapper">
      <FlatInput
        value={this.props.weeklyHours[beginningOfTime]}
        onInputChange={this.editLatest}
        defaultText='z.B. 40' />
    </fb>)
  }

  renderMultirow = () => {
    const { weeklyHours } = this.props
    const smartWeeksArr = this.smartWeeksArray()

    return(
      <fb className='inputWrapper'>
        { smartWeeksArr.map((smartWeek, i) => {
          const initial  = smartWeeksArr.indexOf(smartWeek) === 0
          const isLatest = smartWeeksArr.indexOf(smartWeek) === smartWeeksArr.length - 1
          return (
            <fb className='weeklyHoursRow' key={smartWeek}>
              <fb className={cn({ dateInfo: 1, active: isLatest})} >
                <fb className='dateInfoText'>{initial ? 'bis zum' : 'ab dem'}</fb>
                <fb className='datePickerWrapper'>
                  <DatePicker
                    selected={initial ? smartWeekToMom(smartWeeksArr[1]) : smartWeekToMom(smartWeek)} // if INITIAL we show: biz Zum 11.11.11 -> 40 Stunden
                    onChange={(newSW) => this.replaceLastDate(momToSmartWeek(newSW), weeklyHours[smartWeek])}
                    filterDate={this.dateAllowed}
                    disabled={!isLatest}
                    className={cn({datePicker: true, active: isLatest})}
                  />
                </fb>
              </fb>
              <FlatInput
                value={weeklyHours[smartWeek]}
                onInputChange={this.editLatest}
                disabled={!isLatest}
              />
            </fb>
        )})}
      </fb>
    )
  }

  render = () => {
    return(
      <fb className="weeklyHoursInputMain">
        { this.isMultirow()
            ? this.renderMultirow()
            : this.renderSinglerow()
         }
        <fb className='actionButtons'>
          { this.isMultirow() &&
            <fb className='icon removeButton icon-delete lightButton' onClick={this.deleteLastEntry}/>
          }
          { this.props.extendable &&
            <fb className="extendButton lightButton" onClick={this.addNewRow}>
              <fb className='icon icon-arrow_drop_down' />
              <fb className="text">erweitern</fb>
            </fb>
          }
        </fb>
      </fb>
    )
  }
}
