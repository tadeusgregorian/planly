//@flow
import React from 'react'
import cn from 'classnames'
import { shiftCellWidth, weekDaysGerman, weekDays } from 'constants/roster'
import type { Day, DayNote } from 'types/index'
import './styles.css'

type Props = {
  day: number, // 0 - 6
  date: ?string, // template weeks have no date eg.: '2.7'
  openNote: (Day)=>void,
  dayNote: ?DayNote,
  adminMode: boolean,
  isToday: boolean,
  isHoliday: boolean,
}

export default ({ day, date, openNote, dayNote, adminMode, isToday, isHoliday }: Props) => {
  const style = {width: shiftCellWidth}
  const noteStyle = dayNote && { backgroundColor: dayNote.color }

  const noteClicked = () => adminMode && openNote(weekDays[day])

  return(
    <fb className={cn({headDayMain: 1, adminMode, isHoliday })} key={day} style={style} data-type='head-day' data-day={day} >
      { dayNote &&
        <fb
          className='noteBar'
          style={noteStyle}
          onClick={noteClicked}
          data-balloon={dayNote.note}
          data-balloon-pos="down"
        ><div className='text'>{dayNote.note}</div>
      </fb>
      }
      { isToday &&
        <fb className='todayFlagWrapper' data-balloon='HEUTE' >
          <fb className='todayFlag icon icon-flag' />
        </fb>
      }
      <fb className='mainRow'>
        <fb className='day'>{weekDaysGerman[day]}</fb>
        { date && <fb className='date'>{date}</fb> }
        <fb className='addNoteIcon icon icon-assignment' onClick={noteClicked}></fb>
      </fb>
    </fb>
  )
}
