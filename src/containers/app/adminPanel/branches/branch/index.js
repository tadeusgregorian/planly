import React from 'react'
import './styles.css'
import cN from 'classnames'
import WithTooltip from 'components/withTooltip'

export default ({branch, users, openAddEditBranchPopup, openDeleteBranchPopup}) => {

  const branchContainsUsers = users.find(u => u.branches[branch.id])
  const deleteDisabled = branch.notDeletable || branchContainsUsers
  const deleteTooltipText = branch.notDeletable  ? 'Die Hauptfiliale ist nicht löschbar' : 'Es können nur leere Filialen gelöscht werden'

  return(
    <fb key={branch.id} className='branches-list-element'>
      <icon className="branchIcon icon-navigate_next" />
      <fb className="branchName">{branch.name}</fb>
      <button className="button editBranchButton" onClick={() => openAddEditBranchPopup(true, branch)}>bearbeiten</button>
      <WithTooltip pos='left' text={deleteTooltipText} noTooltip={!deleteDisabled}>
        <icon
          className={cN({'icon-bin': true, deleteIcon: true, disabled: deleteDisabled})}
          onClick={() => !deleteDisabled && openDeleteBranchPopup(branch)} />
      </WithTooltip>
    </fb>
  )
}
