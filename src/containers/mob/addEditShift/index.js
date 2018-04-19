//@flow
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import cn from 'classnames'
import sortBy from 'lodash/sortBy'
//import type { Connector } from 'react-redux'
import { generateGuid } from 'helpers/index'
import TimeInputRow from './timeInputRow';
import DateAndTimeDisplay from './dateAndTimeDisplay';
import MobSelectField from './mobSelectField'
import { minToTimeString } from 'helpers/index'
import { withRouter } from 'react-router-dom'
import currentUser from 'selectors/currentUser';
import {shiftDataValid, zipShift} from './localHelpers'

import {saveShiftToDB, saveShiftEditToDB} from 'actions/roster/index';
import type {SaveShiftToDBParams} from 'actions/roster/index';
import {unfocusShift} from 'actions/ui/mobile';

import type { Store, User, Shift, Branch, Location, Position, PreShift, MinimalShift } from 'types/index'

import './styles.css'

type State = {
  visible: boolean,
  startTime: string,
  endTime: string,
  breakMinutes: string | number,
  userID: string,
  location: ?string,
  position: ?string,
  error: ?string,
}

type Props = {
  currentUser: User,
  users: Array<User>,
  shifts: Array<Shift>,
  shift: ?Shift,
  branches: Array<Branch>,
  positions: Array<Position>,
  currentWeekID: string,
  currentBranch: string,
  history: any,
  match: any,
  saveShiftToDB: (SaveShiftToDBParams)=>Promise<any>,
  saveShiftEditToDB: (PreShift, MinimalShift)=>Promise<any>,
  unfocusShift: Function,
}

class AddEditShift extends PureComponent {
  state: State
  props: Props
  inputRef: any

  constructor(props){
    super(props)

    const shift = this.props.shift

    this.state = {
      startTime: shift ? minToTimeString(shift.s) : '',
      endTime: shift ? minToTimeString(shift.e) : '',
      breakMinutes: shift ? shift.b : '',
      visible: false,
      userID:  shift ? shift.user : '',
      location: shift ? shift.location : '',
      position: shift ? shift.position : null,
      error: null,
    }
  }

  componentDidMount = () => {
    setTimeout(()=>this.setState({ visible: true }), 1)
  }

  goBack = () => this.props.history.push('/mob/shiftBoard')

  tryToSaveChanges = () => {
    const shiftCreation = this.props.match.params.shiftID === 'new'
    const { startTime, endTime, breakMinutes, location, position, userID } = this.state
    const { saveShiftToDB, saveShiftEditToDB, unfocusShift, shift } = this.props
    const shiftInput = { startTime, endTime, breakMinutes }

    if(!shiftDataValid(shiftInput)) return this.setState({ error: 'Zeiteingabe fehlerhaft' })
    if(!this.userID) return this.setState({ error: 'Mitarbeiter angeben' })

    const minimalShift = zipShift(shiftInput)
    const newShift = {
      id: shiftCreation ? generateGuid() : (shift ? shift.id : ''), // double check just to silence flow up
      day,
      user,
      note,
      location,
      position,
      ...minimalShift
    }
      //this.isAdmin ? saveShiftToDB({ shifts: [newShift] }) : saveShiftEditToDB(shift, minimalShift)
  }

  renderTimeInputRow = () => {
    const { startTime, endTime, breakMinutes } = this.state
    return(
      <TimeInputRow {...{ startTime, endTime, breakMinutes }}
        setStartTime={(t) => this.setState({startTime: t})}
        setEndTime={(t) => this.setState({endTime: t})}
        setBreakMinutes={(t) => this.setState({ breakMinutes: t})}
      />
    )
  }

  positionChanged = (val) => this.setState({ position: val })
  userChaned = (val) => this.setState({ userID: val, position: val === 'open' ? 'all' : null })
  locationChanged = (val) => this.setState({ location: val === 'none' ? '' : val })

  render(){
    const { visible, userID, location, position } = this.state
    const { currentUser, branches, shift, currentWeekID, users, currentBranch, positions } = this.props
    const { isAdmin } = currentUser
    const branchObj: Branch = (branches.find(b => b.id === currentBranch): any)
    const branchName = branchObj ? branchObj.name : ''
    const locs: ?Array<Location> = (branchObj.locations && Object.values(branchObj.locations): any)
    const shiftDay = shift ? shift.day : ''
    const weekID = currentWeekID
    const openShift = userID === 'open'

    const usersOfBranch = users.filter(u => !!u.branches[currentBranch])
    const emptyOption = { value: 'none', label: '-' }
    const openOption = { value: 'open', label: 'Offene Schicht' }
    const allPosOption = { value: 'all', label: 'Alle' }
    const userOptions = usersOfBranch.map(u => ({ value: u.id, label: u.name }))
    const userOptionsExt = [openOption].concat(sortBy(userOptions, 'label'))
    const locOptions = locs && locs.map(l => ({ value: l.id, label: l.name })).concat(emptyOption)
    const posOptions = [allPosOption].concat(positions.map(p => ({ value: p.id, label: p.name })))

    return (
      <fb className={cn({addEditShiftMainMobile: 1, visible})}>
        <fb className="topbar">
          <fb className="btn left" onClick={this.goBack}>Abbrechen</fb>
          <fb className="btn right">Speichern</fb>
        </fb>
        <fb className="addEditShiftContentMobile">
          <DateAndTimeDisplay {...{branchName, shiftDay, weekID }} />
          {this.renderTimeInputRow()}
          { !isAdmin
            ? <fb className="infoText">Bearbeite deine Schicht.</fb>
            : <fb className="adminWrapper">
                <MobSelectField
                  options={userOptionsExt}
                  value={userID}
                  onChange={this.userChaned}
                  label='MITARBEITER'
                  outerClass='row selRow' />
                { openShift &&
                  <MobSelectField
                    options={posOptions}
                    value={position}
                    onChange={this.positionChanged}
                    label='BEREICH'
                    outerClass='row selRow' />
                }
                { locs &&
                  <MobSelectField
                    options={locOptions}
                    value={location || 'none'}
                    onChange={this.locationChanged}
                    label='BEREICH'
                    outerClass='row selRow' />
                }
              </fb>
          }
        </fb>
      </fb>
    )
  }
}

const actionsToProps = {
  saveShiftToDB,
  saveShiftEditToDB,
  unfocusShift,
}

const mapStateToProps = (state: Store, ownProps: any) => ({
  currentUser: currentUser(state),
  shifts: state.roster.shiftWeek,
  shift: state.roster.shiftWeek.find(s => s.id === ownProps.match.params.shiftID),
  branches: state.core.branches,
  currentWeekID: state.ui.roster.currentWeekID,
  currentBranch: state.ui.roster.currentBranch,
  users: state.core.users,
  positions: state.core.positions
})

export default withRouter(connect(mapStateToProps, actionsToProps)(AddEditShift))
