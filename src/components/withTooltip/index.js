//@flow
import React from 'react'
import './styles.css'

type Props = {
  children: any,
  pos?: 'top' | 'left' | 'righ' | 'bottom',
  noTooltip?: any,
  text: string
}

export default ({pos, text, noTooltip, children}: Props) => {
  return(
    noTooltip ?
      <fb className="theTooltip" >{children}</fb> :
      <fb className="theTooltip" data-balloon={text} data-balloon-pos={pos || 'top'} >{children}</fb>
  )
}
