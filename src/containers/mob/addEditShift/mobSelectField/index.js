//@flow
import React, { PureComponent } from 'react'
import cn from 'classnames'
import withFocus from 'components/withFocus'
//import {testingForMobile} from 'configs/index';
import './styles.css'

type Props = {
  onChange: (string)=>any,
  value: string,
  options: Array<{value: any, label: string}>,
  label?: string,
  outerClass?: string,
  innerClass?: string,
  labelClass?: string,
  onBlur?: ()=>any,
  onFocus?: ()=>any,
  focused?: ?boolean
}

class MobSelectField extends PureComponent{
  props: Props;
  ref: any;

  onClick = () => {
    this.ref && !this.props.focused && this.ref.focus()
  }


  render() {
    const {onChange, value, label, outerClass, innerClass, labelClass, onBlur, onFocus, focused, options } = this.props

    const curOption = options.find(o => o.value === value)
    const curLabel = curOption ? curOption.label : ''

    return (
      <fb className={cn({mobileSelectWrapper: 1, [outerClass||'1']: 1, focused })} onClick={this.onClick}>
          <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onBlur={onBlur && onBlur}
            onFocus={onFocus && onFocus}
            ref={(c)=> {this.ref = c}}
            >
            {options.map((o, i) => (<option value={o.value} key={i}>{o.label}</option>))}
          </select>
          {
            true &&
            <fb className={cn({overlay: 1, [innerClass||'1']: 1, focused })}>
              <fb>{curLabel}</fb>
              { focused
                ? <icon className={cn({'icon-arrow_drop_up':1, 'icon':1 })}  />
                : <icon className={cn({'icon-arrow_drop_down':1, 'icon':1, 'hidden': value === 'none' })}  />
              }
            </fb>
          }
          { label && <fb className={cn({boxLabel: 1, [labelClass||'1']: 1, focused })}>{label}</fb> }
      </fb>
    )
  }
}

export default withFocus(MobSelectField)
