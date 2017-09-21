//@flow
import React, { PureComponent } from 'react'
import cn from 'classnames'
import { connect } from 'react-redux'
import type { Connector } from 'react-redux'
import type { Store, Branches, ShiftEdits } from 'types/index'

import { changeCurrentBranch , changeCurrentWeekID } from 'actions/ui/roster'
import { getWeek, getYear } from 'helpers/roster'
import { isInsidePopover, isEditRow, getBranch, getWeekID } from './localHelpers'
import './styles.css'

type OwnProps = {
  shiftEdits: ShiftEdits,
  closePopover: ()=>void
}
type ConProps = {
  branches: Branches,
  currentBranch: string,
  currentWeekID: string,
  changeCurrentBranch: (string)=>{},
  changeCurrentWeekID: (string)=>{}
}
type Props = OwnProps & ConProps

class EditsPopover extends PureComponent{

  componentDidMount = () => {document.addEventListener('click',   this.clickListener)}
  componentWillUnmount = () => {document.removeEventListener('click',   this.clickListener)}

  clickListener = (e: any) => {
    const t = e.target
    if(!isInsidePopover(e.target)){
      this.props.closePopover()
      return
    }
    if (!isEditRow(t)) return
    const difBranch  = getBranch(t) !== this.props.currentBranch
    const difWeekID  = getWeekID(t) !== this.props.currentWeekID
    difBranch && this.props.changeCurrentBranch(getBranch(t))
    difWeekID && this.props.changeCurrentWeekID(getWeekID(t))
  }

  isNotClickable = (weekID, branch) =>{
    const sameWeekID = weekID === this.props.currentWeekID
    const sameBranch = branch === this.props.currentBranch
    return sameWeekID && sameBranch
  }

  getEdits = () => {
    const { shiftEdits, branches } = this.props
    const branchesWithEdits: Array<string> = shiftEdits.reduce((acc, val) => acc.includes(val.branch) ? acc : [ ...acc, val.branch ] , [])

    return branchesWithEdits.map(branchID => {
      const branch = branches.find(b => b.id === branchID)
      const branchName = branch && branch.name
      const editsInBranch = shiftEdits.filter(s => s.branch === branchID)
      const weeksWithEdits: Array<number> = editsInBranch.reduce((acc, val) => acc.includes(val.weekID) ? acc : [ ...acc, val.weekID ] , [])
      return(
        <fb className='branchEditsWrapper' key={branchID}>
          <fb className='branchHead'>{ branchName }</fb>
          <fb className='branchEdits'>
            { weeksWithEdits.map(week => (
              <fb className={cn({editRow: true, notClickable: this.isNotClickable(week, branchID)})} key={week} data-week={week} data-branch={branchID} data-type='jumpto'>
                <fb className='arrowLeft icon-arrow-left2 icon'></fb>
                <fb className='editMain'>
                  <fb className='week'>{'KW ' + getWeek(week)}</fb>
                  <fb className='year'>{getYear(week)}</fb>
                </fb>
                <fb className='count'>{editsInBranch.filter(s => s.weekID === week).length}</fb>
                <fb className='icon pencilIcon icon-pen'></fb>
              </fb>
            ))}
          </fb>
        </fb>
    )})
  }

  render(){

    return(
      <fb className='actionBar_editsPopoverMain popover_at arrowRight' data-type='editspopover'>
        <fb className='popoverContent'>
          { this.getEdits() }
        </fb>
        <fb className='footer'></fb>
      </fb>
    )
  }
}

const mapActions = ({
  changeCurrentBranch,
  changeCurrentWeekID
})

const mapStateToProps = (state: Store) => ({
  branches: state.core.branches,
  currentBranch: state.ui.roster.currentBranch,
  currentWeekID: state.ui.roster.currentWeekID,
})

const connector: Connector<OwnProps, Props> = connect(mapStateToProps, mapActions)
export default connector(EditsPopover)
