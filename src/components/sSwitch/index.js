//@flow
import React from 'react'
import cn from 'classnames'
import './styles.css'


type Props = {
  options: Array<string>,
  selected: number,
  onChange: (optionName: number)=>any,
  disabled?: boolean,
}

const SSwitch = (props: Props) => {

  return(
    <fb className="sswitchMain" >
      {props.options.map((o, i) =>
        <fb
          key={o}
          className={cn({switchOption: 1, selected: i === props.selected })}
          onClick={() => i !== props.selected && props.onChange(i)}
          >{o}</fb>
      )}
    </fb>
  )
}

export default SSwitch
