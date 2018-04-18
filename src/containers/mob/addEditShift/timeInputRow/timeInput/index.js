//@flow
import React, { PureComponent } from 'react'
import cn from 'classnames'
import withFocus from 'components/withFocus'
//import {testingForMobile} from 'configs/index';

import './styles.css'

type Props = {
  onTimeChange: (string)=>any,
  time: string,
  label?: string,
  outerClass?: string,
  innerClass?: string,
  labelClass?: string,
  onBlur?: ()=>any,
  onFocus?: ()=>any,
  focused?: ?boolean,
}

class TimeInput extends PureComponent{
  props: Props;
  ref: any;

  render() {
    const {onTimeChange, time, label, outerClass, innerClass, labelClass, onBlur, onFocus, focused } = this.props

    return (
      <fb className={cn({inputWrapper: 1, [outerClass||'1']: 1 })} onClick={() => this.ref && this.ref.focus()}>
          <input
            onBlur={onBlur && onBlur}
            onFocus={onFocus && onFocus}
            ref={(c)=> {this.ref = c}}
            type="time"
            value={time}
            onChange={(e) => {onTimeChange(e.target.value)}}
          />
          { true && <fb className={cn({overlay: 1, [innerClass||'1']: 1, focused })}>{time}</fb> }
          { label && <fb className={cn({label: 1, [labelClass||'1']: 1, focused })}>{label}</fb> }
      </fb>
    )
  }
}

export default withFocus(TimeInput)
