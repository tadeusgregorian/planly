//@flow
import React from 'react'
import type { Branch } from 'types/index'
import './styles.css'

type Props = {
  branches: Array<Branch>,
  branchPicked: (string)=>any,
}

export default (props: Props) => {
  const { branches, branchPicked } = props

  return(
    <fb className="navBarBranchPickMain">
      {branches.map( b =>
        <fb
          className='branchItem'
          key={b.id}
          onClick={()=>branchPicked(b.id)} >{b.name}</fb>
      )}
    </fb>
  )
}
