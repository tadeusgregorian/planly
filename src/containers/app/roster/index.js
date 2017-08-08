import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import './styles.css'

class Roster extends PureComponent {

  render() {
    return(
      <fb className="rosterMain">
        <fb className='rosterSubBar'> The Sub bar </fb>
      </fb>
    )
  }
}

const mapStateToProps = (state) => ({
  users: state.core.usuers
})

export default connect(mapStateToProps)(Roster)
