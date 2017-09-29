//@flow
import React from 'react'
import cn from 'classnames'
import './styles.css'

type Props = {
  view: string,
  changeView: (string)=>void
}

export default (props: Props) => {

  const { view, changeView } = props

  const calendarSelected = view === 'calendar'
  const listSelected = view === 'list'

  const onCalendarClick = () => !calendarSelected && changeView('calendar')
  const onListClick = () => !listSelected && changeView('list')

  return(
    <fb className="viewSwitchMain">
      <fb className={cn({leftBtn: true, calendarBtn: true, selected: calendarSelected})} onClick={onCalendarClick}>Kalender</fb>
      <fb className={cn({rightBtn: true, listBtn: true, selected: listSelected})} onClick={onListClick}>Liste</fb>
    </fb>
  )
}
