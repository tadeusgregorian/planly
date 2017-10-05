//@flow
import React, { PureComponent } from 'react'
import cn from 'classnames'
import FlatFormRow from 'components/flatFormRow'
import InitialOvertimeConfig from './initialOvertimeConfig'
import type { InitialOvertime } from 'types/index'
import './styles.css'

type Props = {
  initialOvertime: InitialOvertime,
  changeInitialOvertime: (InitialOvertime)=>any,
}

export default class ExtendedUserConfigs extends PureComponent{
  state: { expanded: boolean }
  props: Props

  state = { expanded: false }

  render(){
    const { expanded } = this.state

    return(
      <fb className="extendedUserConfigsMain">
        <fb className={cn({head: true, expanded })} onClick={()=>this.setState({expanded: !expanded})}>
          <fb className={'expandIcon icon ' + (expanded ? 'icon-arrow_drop_up' : 'icon-arrow_drop_down')} />
          <fb className='text'>Zeitkonto</fb>
        </fb>
        <fb className='content' style={{display: expanded ? 'flex' : 'none'}}>
          <FlatFormRow label='Überstunden Übertrag'>
            <InitialOvertimeConfig { ...this.props }/>
          </FlatFormRow>
        </fb>
      </fb>
    )
  }
}
