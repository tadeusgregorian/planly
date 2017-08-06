import React from 'react'
import './styles.css'
import cN from 'classnames'
import WithTooltip from 'components/withTooltip'

export default ({group, users, openAddEditGroupPopup, openDeleteGroupPopup}) => {

  const groupContainsUsers = users.find(u => u.assignedGroups[group.id])
  const deleteDisabled = group.notDeletable || groupContainsUsers
  const deleteTooltipText = group.notDeletable  ? 'Diese Gruppe ist nicht löschbar' : 'Es können nur leere Gruppen gelöscht werden'

  return(
    <fb key={group.id} className='groups-list-element'>
      <icon className="groupIcon icon-navigate_next" />
      <fb className="groupName">{group.name}</fb>
      <button className="button editGroupButton" onClick={() => openAddEditGroupPopup(true, group)}>bearbeiten</button>
      <WithTooltip pos='left' text={deleteTooltipText} noTooltip={!deleteDisabled}>
        <icon
          className={cN({'icon-bin': true, deleteIcon: true, disabled: deleteDisabled})}
          onClick={() => !deleteDisabled && openDeleteGroupPopup(group)} />
      </WithTooltip>
    </fb>
  )
}
