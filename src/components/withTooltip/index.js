import React from 'react'
import './styles.css'

export default ({pos, text, noTooltip, children}) => {
  return(
    noTooltip ?
      <fb className="theTooltip" >{children}</fb> :
      <fb className="theTooltip" data-balloon={text} data-balloon-pos={pos || 'top'} >{children}</fb>
  )
}
