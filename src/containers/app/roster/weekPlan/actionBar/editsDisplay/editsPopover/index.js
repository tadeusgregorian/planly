//@flow
import React, { PureComponent } from 'react'
import cn from 'classnames'
import { connect } from 'react-redux'
import type { Connector } from 'react-redux'
import type { Store, Branches, ShiftEdits } from 'types/index'

import { changeCurrentBranch , changeCurrentSmartWeek } from 'actions/ui/roster'
import { getWeek, getYear } from 'helpers/roster'
import { isInsidePopover, isEditRow, getBranch, getSmartWeek } from './localHelpers'
import './styles.css'

type OwnProps = {
  shiftEdits: ShiftEdits,
  closePopover: ()=>void
}
type ConProps = {
  branches: Branches,
  currentBranch: string,
  currentSmartWeek: number,
  changeCurrentBranch: (string)=>{},
  changeCurrentSmartWeek: (number)=>{}
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
    const difSmartWeek  = getSmartWeek(t) !== this.props.currentSmartWeek
    difBranch && this.props.changeCurrentBranch(getBranch(t))
    difSmartWeek && this.props.changeCurrentSmartWeek(getSmartWeek(t))
  }

  isNotClickable = (smartWeek, branch) =>{
    const sameSmartWeek = smartWeek === this.props.currentSmartWeek
    const sameBranch = branch === this.props.currentBranch
    return sameSmartWeek && sameBranch
  }

  getEdits = () => {
    const { shiftEdits, branches } = this.props
    const branchesWithEdits: Array<string> = shiftEdits.reduce((acc, val) => acc.includes(val.branch) ? acc : [ ...acc, val.branch ] , [])

    return branchesWithEdits.map(branchID => {
      const branch = branches.find(b => b.id === branchID)
      const branchName = branch && branch.name
      const editsInBranch = shiftEdits.filter(s => s.branch === branchID)
      const weeksWithEdits: Array<number> = editsInBranch.reduce((acc, val) => acc.includes(val.smartWeek) ? acc : [ ...acc, val.smartWeek ] , [])
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
                <fb className='count'>{editsInBranch.filter(s => s.smartWeek === week).length}</fb>
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
  changeCurrentSmartWeek
})

const mapStateToProps = (state: Store) => ({
  branches: state.core.branches,
  currentBranch: state.ui.roster.currentBranch,
  currentSmartWeek: state.ui.roster.currentSmartWeek,
})

const connector: Connector<OwnProps, Props> = connect(mapStateToProps, mapActions)
export default connector(EditsPopover)
