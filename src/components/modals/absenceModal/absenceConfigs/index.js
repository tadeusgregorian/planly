//@flow
import React, { PureComponent } from 'react'
import type { WorkDays } from 'types/index'
import SCheckbox from 'components/sCheckbox'
import Expander from 'components/expander'
import WorkDaysPicker from 'components/workDaysPicker'
import './styles.css'

type Props = {
  unpaid: ?true,
  useAvgHours: ?true,
  workDays: ?WorkDays,
  toggleUnpaid: ()=>any,
  toggleUseAvgHours: ()=>any,
  updateWorkDays: (WorkDays)=>any,
}

export default class AbsenceConfigs extends PureComponent{
  props: Props

  render(){
    const { unpaid, workDays, updateWorkDays, toggleUnpaid, useAvgHours } = this.props

    return(
      <Expander label='Erweitert Einstellungen'>
        <fb className='absenceConfigsMain'>
          <fb className="unpaidWrapper">
            <fb className='label'>Unbezahlt</fb>
            <SCheckbox isChecked={!!unpaid} onCheck={toggleUnpaid} />
          </fb>
          <fb className="workDaysWrapper">
            <WorkDaysPicker workDays={workDays} onChange={updateWorkDays} inputsHidden={(!!unpaid || !useAvgHours)} />
          </fb>
        </fb>
      </Expander>
    )
  }
}
