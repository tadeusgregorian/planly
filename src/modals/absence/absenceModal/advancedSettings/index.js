//@flow
import React from 'react'
import cn from 'classnames'
import SCheckbox from 'components/sCheckbox'
import type {WorkDays, AbsenceType} from 'types/index';
import WorkDaysPicker from 'components/workDaysPicker/index';
import './styles.css'

type Props = {
  advancedOpen: boolean,
  unpaid: true | null,
  workDays: WorkDays,
  type: AbsenceType | '',
  setAdvancedOpen: (boolean)=>any,
  setUnpaid: (boolean)=>any,
  changeWorkDays: (WorkDays)=>any
}

export default (props: Props) => {
  const { advancedOpen, setAdvancedOpen, unpaid, setUnpaid, workDays, changeWorkDays, type } = props

  return(
    <fb className='advancedAbsenceModalSettingsMain'>
    <fb className='advancedHead'>
      <fb className={cn({ advncedBtn:1, advancedOpen  })} onClick={() => setAdvancedOpen(!advancedOpen)}>
        <fb className={'icon ' + (advancedOpen ? 'icon-expand_less' : 'icon-expand_more')}></fb>
        <fb className='text'>erweitert</fb>
      </fb>
    </fb>
    { advancedOpen &&
      <fb className='content'>
        { type === 'vac' &&
        <fb className="section">
          <SCheckbox label='unbezahlt' isChecked={unpaid} onCheck={() => setUnpaid(!unpaid)} />
        </fb>
        }
        <fb className="section">
          <fb className="label">Arbeitstage</fb>
          <WorkDaysPicker workDays={workDays} onChange={changeWorkDays} />
        </fb>
      </fb>
    }
  </fb>
  )
}
