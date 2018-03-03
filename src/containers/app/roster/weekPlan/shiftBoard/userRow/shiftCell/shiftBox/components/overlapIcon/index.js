//@flow
import React from 'react'

import './styles.css'

type Props = {
  branchName: string,
}

export default (props: Props) => {
  const { branchName } = props

  const text = 'Überschneidung mit Schicht aus: ' + branchName

  return(
    <fb className="overlapIcon" data-balloon={text} data-balloon-length="medium">
      <icon className="icon icon-warning"/>
      <fb className="description">
        Überschneidung
      </fb>
    </fb>
  )
}
