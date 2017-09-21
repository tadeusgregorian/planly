//@flow
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import type { Connector } from 'react-redux'
import type { Store } from 'types/index'

import SModal from 'components/sModal'
import SButton from 'components/sButton'
import './styles.css'

type OwnProps = {
  closeModal: ActionCreator
}
type ConProps = {

}

type Props = OwnProps & ConProps

type State = { selectedTempID: ?string }

class ImportTemplateModal extends PureComponent {
  constructor(props){
    super(props)

    this.state = { selectedTempID: null }
  }

  props: Props
  state: State

  importButtonClicked = () => {
  }

  render(){
    const { closeModal } = this.props

    return(
      <fb className="importTemplateModalMain">
        <SModal.Main onClose={closeModal} title='Vorlage importieren' >
    			<SModal.Body>
            <fb className='content'>
              Welche Vorlage soll importiert werden?
              -hier kommt noch die Auswahl hin-
            </fb>
    			</SModal.Body>
    			<SModal.Footer>
    					<SButton right label='importieren' onClick={this.importButtonClicked}/>
    			</SModal.Footer>
    		</SModal.Main>
      </fb>
    )
  }
}

const actionCreators = {

}

const mapStateToProps = (state: Store) => ({
  templatesFlat: state.roster.templatesFlat,
  currentWeekID: state.ui.roster.currentWeekID,
})

const connector: Connector<OwnProps, Props> = connect(mapStateToProps, actionCreators)
export default connector(ImportTemplateModal)
