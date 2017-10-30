//@flow
import React from 'react'
import './styles.css'

type Props = {
  stepBack: ()=>void,
  stepForward: ()=>void,
}

export default ({ stepBack, stepForward }: Props) => {

  return(
    <fb className="absenceMonthStepperMain">
      <fb className='backBtn stepBtn icon icon-navigate_before'  onClick={stepBack}></fb>
      <fb className='forwardBtn stepBtn icon icon-navigate_next' onClick={stepForward}></fb>
    </fb>
  )
}
