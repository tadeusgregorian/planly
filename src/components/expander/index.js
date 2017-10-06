//@flow
import React, { PureComponent } from 'react'
import cn from 'classnames'
import './styles.css'

type Props = {
  initExpanded?: true | string,
  label: string,
  children: any,
}

export default class Expander extends PureComponent {
  props: Props
  state: { expanded: boolean }

  state = {
    expanded: !!this.props.initExpanded
  }

  render(){
    const { children, label } = this.props
    const { expanded } = this.state

    return(
      <fb className="expanderComponentMain">
        <fb className={cn({head: true, expanded })} onClick={()=>this.setState({expanded: !expanded})}>
          <fb className={'expandIcon icon ' + (expanded ? 'icon-arrow_drop_up' : 'icon-arrow_drop_down')} />
          <fb className='text'>{label}</fb>
        </fb>
        <fb className='content' style={{display: expanded ? 'flex' : 'none'}}>
          {children}
        </fb>
      </fb>
    )
  }
}
