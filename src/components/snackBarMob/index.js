import React from 'react'
import cn from 'classnames'
import WithInOutAnimation from 'components/withInOutAnimation'

import './styles.css'

const SnackBarMob =  ({ type, text, visible }) => {

  return (
    <fb className={cn({snackBarMobMain: 1, visible})}>
        <fb className="text">{text}</fb>
    </fb>
  )
}

export default WithInOutAnimation(SnackBarMob)
