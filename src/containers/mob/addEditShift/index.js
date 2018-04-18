//@flow
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import cn from 'classnames'
//import type { Connector } from 'react-redux'
import TimeInputRow from './timeInputRow';
import { minToTimeString } from 'helpers/index'
import { withRouter } from 'react-router-dom'
import type { Store } from 'types/index'

import './styles.css'

type State = {
  visible: boolean,
  startTime: string,
  endTime: string,
  breakMinutes: string,
  weekID: string,
}

class AddEditShift extends PureComponent {
  state: State
  inputRef: any

  constructor(props){
    super(props)

    const shift = this.props.shift

    this.state = {
      startTime: shift ? minToTimeString(shift.s) : '',
      endTime: shift ? minToTimeString(shift.e) : '',
      breakMinutes: shift ? shift.b : '',
      visible: false,
      weekID: this.props.currentWeekID,
    }

    console.log(this.state)
    console.log(shift)
  }

  componentDidMount = () => {
    setTimeout(()=>this.setState({ visible: true }), 1)
    console.log(this.props.shift)
  }

  goBack = () => this.props.history.push('/mob/shiftBoard')

  render(){
    const { visible, startTime, endTime, breakMinutes } = this.state


    return (
      <fb className={cn({addEditShiftMainMobile: 1, visible})}>
        <fb className="topbar">
          <fb className="btn left" onClick={this.goBack}>Abbrechen</fb>
          <fb className="btn right">Speichern</fb>
        </fb>
        <fb className="addEditShiftContentMobile">
          <TimeInputRow {...{ startTime, endTime, breakMinutes }}
            setStartTime={(t) => this.setState({startTime: t})}
            setEndTime={(t) => this.setState({endTime: t})}
            setBreakMinutes={(t) => this.setState({ breakMinutes: t})}
          />
        </fb>
      </fb>
    )
  }
}

const actionsToProps = {
}

const mapStateToProps = (state: Store, ownProps: any) => ({
  shifts: state.roster.shiftWeek,
  shift: state.roster.shiftWeek.find(s => s.id === ownProps.match.params.shiftID),
  currentWeekID: state.ui.roster.currentWeekID,
})

export default withRouter(connect(mapStateToProps, actionsToProps)(AddEditShift))
