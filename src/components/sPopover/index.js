//@flow
import React, { PureComponent } from 'react'
import { closestWithAttribute } from 'helpers/index'
import './styles.css'

type Props = {
  options: Array<{label: string, value: string}>,
  onSelect: (string)=>void,
  closePopover: ()=>any,
  width: number,
  targetElement?: HTMLElement // just used to get the position top value.
}


export default class SPopover extends PureComponent {
  props: Props;

  componentDidMount =    () => document.addEventListener('click', this.onClick)
  componentWillUnmount = () => document.removeEventListener('click', this.onClick)

  onClick = (e: any) => {
    const clickedOutside = !closestWithAttribute(e.target, 'data-target', 's-popover')
    clickedOutside && this.props.closePopover()
  }

  render(){
    const { targetElement, width, onSelect, options } = this.props
    const top = (targetElement && targetElement.offsetHeight + 1 ) || 0

    return(
      <fb className="sPopoverMain" data-target='s-popover'>
        <fb className='content arrow_box' style={{top, width, left: -width}}>
          {options.map((o, i) =>
            <fb key={i} className='optionRow' data-value={o.value} onClick={()=> onSelect(o.value) }>{o.label}</fb>
          )}
        </fb>
      </fb>
    )
  }
}
