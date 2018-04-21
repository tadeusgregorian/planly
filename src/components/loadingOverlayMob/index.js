import React from 'react'
import cn from 'classnames'
import WithInOutAnimation from 'components/withInOutAnimation'

import './styles.css'

export default WithInOutAnimation(({ visible }) => {
  return <fb className={cn({ loadingOverlayMobMain: 1, visible })}>loading...</fb>
})
