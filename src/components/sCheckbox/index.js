//@flow
import React from 'react'
import './styles.css'

type Props = {
  isChecked: boolean,
  label?: string,
  onCheck: ()=>any,
}

export default (props: Props) => {
  const {onCheck, isChecked, label} = props

  return(
    <fb className="sCheckboxMain">
      <fb className="theBox" onClick={onCheck}>
          <input // not puting onChange here cause it was not working at all -> onClick up there solves it
            checked={isChecked}
            readOnly // is a crazy bugfix cause react sais: onChange handler is missing...
            type="checkbox"
            className="tadeCheckbox" />
            <label></label>
        </fb>
        {label && <fb className="theLabel">{label}</fb>}
    </fb>
  )
}
