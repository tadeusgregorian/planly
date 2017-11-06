//@flow
import React from 'react'
import { connect } from 'react-redux'
import type { Connector } from 'react-redux'
import cn from 'classnames'
import type { Store } from 'types/index'
import { toggleShiftBoardTimeDetails } from 'actions/ui/roster'
import './styles.css'

type Props = {
  toggleShiftBoardTimeDetails: Function,
  timeDetailsVisible: boolean,
}

const TimesDetailsToggler = (props: Props) => {
  const detailsVisible = props.timeDetailsVisible

  return(
    <fb
      className={cn({timesDetailsTogglerMain: 1, active: detailsVisible })}
      onClick={props.toggleShiftBoardTimeDetails}
      data-balloon={'Überstunden-Details ' + (detailsVisible ? 'verbergen' : 'anzeigen')}
    >
      &sum;
    </fb>
  )
}

const actionCreators = {
  toggleShiftBoardTimeDetails
}

const mapStateToProps = (state: Store) => ({
  timeDetailsVisible: state.ui.roster.shiftBoard.timeDetailsVisible
})

const connector: Connector<{}, Props> = connect(mapStateToProps, actionCreators)
export default connector(TimesDetailsToggler)
