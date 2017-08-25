//@flow

import React from 'react'
import './styles.css'

type Props = {
  
}

export default (props: Props) => {

  const { width, height, left, top, isOpen } = this.props.cell
  const sizeAndPos = { width: width + 1, left , top: top - 1 }
  const { cell, toggleOptions, optionsExpanded, note, openNotesModal } = this.props

  return(
    <fb className="resolveEditPopoverMain">
      Bobo here
    </fb>
  )
}
