//@flow
import React from 'react'

import './styles.css'

type Props = {
  userName: string,
  rangeStr: string,
  arrowClicked: Function,
  contentClicked: Function
}

export default (props: Props) => {
  const { userName, rangeStr, arrowClicked, contentClicked } = props

  return(
    <fb className="requestManagerPopoverElement">
      <fb className='jumpToBox icon icon-arrow-left2' onClick={arrowClicked}></fb>
      <fb className='contentBox' onClick={contentClicked}>
        <fb className='userName'>{userName}</fb>
        <fb className='vacData'>{rangeStr}</fb>
      </fb>
    </fb>
  )
}
