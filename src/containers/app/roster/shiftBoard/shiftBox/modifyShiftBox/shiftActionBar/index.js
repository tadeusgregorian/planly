//@flow

import React from 'react'

//import { shiftCellWidth } from 'constants/roster'
import './styles.css'

type Props = {
  inCreation: boolean,
  closeClicked: Function,
  toggleOptionsClicked: Function,
  deleteClicked: Function
}

export default (props: Props) => {

  return(
    <fb className="shiftActionBarMain">
      <fb className='btn deleteBtn icon icon-delete' onClick={props.deleteClicked}></fb>
      <fb className='btn optionsBtn icon icon-dehaze' onClick={props.toggleOptionsClicked}></fb>
      <fb className='btn closeBtn icon icon-close' onClick={props.closeClicked}></fb>
    </fb>
  )
}
