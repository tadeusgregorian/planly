//@flow
import React from 'react'
import './styles.css'

type Props = {
  options: Array<{label: string, value: string}>,
  onSelect: (string)=>void,
  open: boolean,
  width: number,
  targetElement?: HTMLElement // just used to get the position top value.
}


export default (props: Props) => {
  //const display =  props.open ? 'initial' : 'none'
  const { targetElement, width, onSelect } = props
  const top = (targetElement && targetElement.offsetHeight + 1 ) || 0

  return(
    <fb className="sPopoverMain">
      { props.open &&
        <fb className='content arrow_box' style={{top, width, left: -props.width}}>
          {props.options.map((o, i) =>
            <fb key={i} className='optionRow' data-value={o.value} onClick={()=> onSelect(o.value) }>{o.label}</fb>
          )}
        </fb>
      }
    </fb>
  )
}
