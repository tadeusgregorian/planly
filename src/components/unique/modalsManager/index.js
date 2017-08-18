import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { closeModal } from 'actions/ui'
import './styles.css'

class ModalsManager extends PureComponent {

  generateProps = (modal) => ({
    ...modal.props,
    key: modal.modalID,
    closeModal: () => this.props.closeModal(modal.modalID)
  })

  render = () => {
    
    const { modals } = this.props
    return (
      <fb className="modalsMangarMain">
        {modals.map(modal =>
          React.createElement(modal.component, this.generateProps(modal))
        )}
      </fb>
    )
  }
}

const mapDispatchToProps = {
  closeModal
}

const mapStateToProps = (state) => ({
  modals: state.ui.modals
})

export default connect(mapStateToProps, mapDispatchToProps)(ModalsManager)
