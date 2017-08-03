import React from 'react'
import cN from 'classnames';
import './styles.css'

export default ({chips, selectedChips, chipClicked}) => {
  // chips are in this format: [{ID: xyz, name: xyzName}, {ID: zzy, name: zzyName}]
  // selectedChips format: [xyz, zzy]

  return(
    <fb className="chipBarMain">
      {chips.map(g => {
        let isSelected = (selectedChips.indexOf(g.id) >= 0)
        return (
          <fb
            key={g.id}
            className={cN({"chip": true, "selected": isSelected})}
            onClick={() => chipClicked(g.id)}>
            {g.name}
          </fb>
        )
      })}
    </fb>
  )
}
