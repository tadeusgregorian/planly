//@flow
import React from 'react'
import cn from 'classnames'
import SCheckbox from 'components/sCheckbox'
import './styles.css'

type Props = {
  advancedOpen: boolean,
  unpaid: true | null,
  setAdvancedOpen: (boolean)=>any,
  setUnpaid: (boolean)=>any,
}

export default (props: Props) => {
  const { advancedOpen, setAdvancedOpen, unpaid, setUnpaid } = props

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
        <SCheckbox label='unbezahlt' isChecked={unpaid} onCheck={() => setUnpaid(!unpaid)} />
      </fb>
    }
  </fb>
  )
}
