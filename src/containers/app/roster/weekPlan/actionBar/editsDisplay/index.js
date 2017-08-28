//@flow
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import type { Connector } from 'react-redux'
import type { Store, ShiftEdits } from 'types/index'

import EditsPopover from './editsPopover'
import './styles.css'

type OwnProps = {}
type ConProps = { shiftEdits: ShiftEdits }
type Props = OwnProps & ConProps
type State = { popOpen: boolean }

class EditsDisplay extends PureComponent{
  state: State
  props: Props

  constructor(props){ super(props);
    this.state = { popOpen: false }
  }

  togglePopover = () => this.setState({ popOpen: !this.state.popOpen})
  closePopover = () => this.setState({ popOpen: false })

  render(){
    const { popOpen } = this.state
    const { shiftEdits } = this.props
    const editsCount = shiftEdits.length

    return(
      <fb className="actionBar_editsDisplayMain">
        <fb className='content' onClick={this.togglePopover}>
          <fb className='count'>{editsCount}</fb>
          <fb className='icon icon-pen penIcon'></fb>
        </fb>
        { popOpen &&  <EditsPopover
          closePopover={this.closePopover}
          shiftEdits={shiftEdits} />
        }
      </fb>
    )
  }
}

const mapStateToProps = (state: Store) => ({
  shiftEdits: state.roster.shiftEdits
})

const connector: Connector<OwnProps, Props> = connect(mapStateToProps)
export default connector(EditsDisplay)
