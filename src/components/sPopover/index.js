//@flow
import React from 'react'
import './styles.css'

type Props = {
  options: Array<{lable: string, value: string}>,
  onSelect: (string)=>void,
  open: boolean,
  width: number,
  targetElement?: HTMLElement // just used to get the position top value.
}


export default (props: Props) => {
  //const display =  props.open ? 'initial' : 'none'
  const { targetElement, width } = props
  const top = (targetElement && targetElement.offsetHeight + 1 ) || 0

  return(
    <fb className="sPopoverMain">
      { props.open &&
        <fb className='content' style={{top, width, left: -props.width}}>
          {props.options.map((o, i) =>
            <fb key={i} className='optionRow' data-value={o.value}>{o.lable}</fb>
          )}
        </fb>
      }
    </fb>
  )
}
