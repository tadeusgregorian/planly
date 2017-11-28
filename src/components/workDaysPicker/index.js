//@flow
import React, { PureComponent } from 'react'
import has from 'lodash/has'
import omit from 'lodash/omit'
import cn from 'classnames'
import type { WorkDays } from 'types/index'
import './styles.css'

type Props = {
  onChange: (WorkDays) => any,
  workDays: ?WorkDays,
}

export default class WorkDaysPicker extends PureComponent{
  props: Props

  dayClicked = (weekDay: string) => {
    const { workDays } = this.props
    const removing = has(workDays,weekDay)
    const newWorkDays = removing ? omit(workDays, weekDay) : { ...workDays, [weekDay]: 1 }
    this.props.onChange(newWorkDays)
  }

  render(){
    const workDays = this.props.workDays || {}

    const weekDaysArray = [
      {label: 'Mo', value: 'mo'},
      {label: 'Di', value: 'tu'},
      {label: 'Mi', value: 'we'},
      {label: 'Do', value: 'th'},
      {label: 'Fr', value: 'fr'},
      {label: 'Sa', value: 'sa'},
      {label: 'So', value: 'su'},
    ]

    return(
      <fb className="wordDaysAndHoursMain">
        <fb className='row workDaysRow'>
          <fb className='workDaysContent'>
            { weekDaysArray.map(w =>
              <fb
                key={w.value}
                className={cn({dayBtn: true, selected: has(workDays, w.value) })}
                onClick={()=>this.dayClicked(w.value)}
              >
                {w.label}
              </fb>
            )}
          </fb>
        </fb>
      </fb>
    )
  }
}
