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
  empty: boolean,
}

export default ({ overtime, userID, correction, status, type, empty }: Props) => {

  const _overtime = overtime || 0

  const overtimeShort = withSign(extractHours(_overtime))
  const overtimeComplete = overtimeShort + ' h / ' + minToTime(_overtime).minutes + '  min'
  const displayOvertime = status === 'STARTED' || status === 'START_WEEK'

  if(empty) return <fb className="overtimeCellMain" style={{width: overtimeCellWidth}}/>

  if(type === 'PRE') return(
    <fb className="overtimeCellMain" style={{width: overtimeCellWidth}} >
      { status === 'BEFORE_START' &&
      <fb className='setInFuture' data-balloon='Initale Überstunden schon eingetragen.'>-</fb>
      }
      { status === 'NOT_SET'      &&
      <fb data-balloon='Überstunden hier eintragen' >
        <fb
          className='icon icon-question questionMark'
          data-type='pre-otime-cell'
          data-user={userID}
          data-status={status}
        />
      </fb>
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
    </fb>
  )
}
