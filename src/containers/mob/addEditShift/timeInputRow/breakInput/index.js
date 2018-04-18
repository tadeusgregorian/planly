//@flow
import React, { PureComponent } from 'react'
import cn from 'classnames'
import withFocus from 'components/withFocus'
//import {testingForMobile} from 'configs/index';
import './styles.css'

type Props = {
  onChange: (string)=>any,
  value: string,
  label?: string,
  outerClass?: string,
  labelClass?: string,
  onBlur?: ()=>any,
  onFocus?: ()=>any,
  focused?: ?boolean,
}

class BreakInput extends PureComponent{
  props: Props;
  ref: any;

  render() {
    const {onChange, value, label, outerClass, labelClass, onBlur, onFocus, focused } = this.props

    return (
      <fb className={cn({breakWrapper: 1, [outerClass||'1']: 1, focused })} onClick={() => this.ref && this.ref.focus()}>
          <input
            onBlur={onBlur && onBlur}
            onFocus={onFocus && onFocus}
            ref={(c)=> {this.ref = c}}
            type="number"
            min='0'
            max='999'
            value={value}
            onChange={(e) => {onChange(e.target.value)}}
          />
          { label && <fb className={cn({label: 1, [labelClass||'1']: 1, focused })}>{label}</fb> }
      </fb>
    )
  }
}

export default withFocus(BreakInput)
