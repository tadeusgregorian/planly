//@flow
import React from 'react'
import cn from 'classnames'
import './styles.css'

type Props = {
  nonWorkersHidden: boolean,
  hideNonWorkers: (boolean)=>void
}

export default ({nonWorkersHidden, hideNonWorkers}: Props) => {

  const eyeClicked = () => hideNonWorkers(!nonWorkersHidden)

  return(
    <fb className="usersHeadMain">
      <fb className='text'>Mitarbeiter</fb>
      <fb
        className={cn({eye:1, icon:1, 'icon-visibility':1, active: nonWorkersHidden})}
        onClick={eyeClicked}></fb>
    </fb>
  )
}
