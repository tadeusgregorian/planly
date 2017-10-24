//@flow
import React, { PureComponent } from 'react'
//import type { WorkDays } from 'types/index'
import SCheckbox from 'components/sCheckbox'
import Expander from 'components/expander'
//import WorkDaysPicker from 'components/workDaysPicker'
import './styles.css'

type Props = {
  unpaid: ?true,
  toggleUnpaid: ()=>any,
  // useAvgHours: ?true,
  // workDays: ?WorkDays,
  // toggleUseAvgHours: ()=>any,
  // updateWorkDays: (WorkDays)=>any,
}

export default class AbsenceConfigs extends PureComponent{
  props: Props

  render(){
    const { unpaid, toggleUnpaid } = this.props

    return(
      // <Expander label='Erweitert Einstellungen'>
        <fb className='absenceConfigsMain'>
          <fb className="unpaidWrapper">
            <SCheckbox isChecked={!!unpaid} onCheck={toggleUnpaid} mini/>
            <fb className='label'>Unbezahlt</fb>
          </fb>
        </fb>
      // </Expander>
    )
  }
}
