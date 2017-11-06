//@flow
import React from 'react'
import cn from 'classnames'
import { overtimeCellWidth } from 'constants/roster'
import { minToTime, extractHours, withSign } from 'helpers/roster'
import type { OvertimeStatus } from 'types/index'
import './styles.css'

type Props = {
  overtime: ?number,
  status: OvertimeStatus,
  type: 'PRE' | 'POST',
  // correction: ?Correction,
  userID: string,
}

export default ({overtime, userID, correction, status, type}: Props) => {

  const _overtime = overtime || 0

  const overtimeShort = withSign(extractHours(_overtime))
  const overtimeComplete = overtimeShort + ' h / ' + minToTime(_overtime).minutes + '  min'
  const displayOvertime = status === 'STARTED' || status === 'START_WEEK'

  if(type === 'PRE') return(
    <fb className="overtimeCellMain" style={{width: overtimeCellWidth}} >
      { status === 'BEFORE_START' && <fb>-</fb> }
      { status === 'NOT_SET'      && <fb
          className='icon icon-question questionMark'
          data-type='pre-otime-cell'
          data-user={userID}
          data-status={status} />
      }
      { displayOvertime && <fb
          className={cn({overtimeWrapper: 1, startWeek: status === 'START_WEEK'})}
          data-balloon={overtimeComplete}
          data-type='pre-otime-cell'
          data-user={userID}
          data-status={status}
          >{overtimeShort}</fb>
      }
    </fb>
  )

  if(type === 'POST') return (
    <fb className="overtimeCellMain post" style={{width: overtimeCellWidth}} data-balloon={overtimeComplete} >
      {displayOvertime && overtimeShort}
      {/* { correction && <fb className='icon icon-av_timer timerIcon' /> } */}
    </fb>
  )
}
