//@flow
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import type { Connector } from 'react-redux'
import type { Store, TemplateFlat } from 'types/index'

import SModal from 'components/sModal'
import SButton from 'components/sButton'
import './styles.css'

type OwnProps = {
  closeModal: ActionCreator
}
type ConProps = {
  templatesFlat: Array<TemplateFlat>,
  currentBranch: string,
}

type Props = OwnProps & ConProps

type State = {
  selectedTempID: ?string
}

class ImportTemplateModal extends PureComponent {
  props: Props
  state: State

  state = {
    selectedTempID: null
  }


  importButtonClicked = () => {
  }

  tempClicked = (tempID: string) => {
    console.log(tempID);
  }

  render(){
    const { closeModal, templatesFlat, currentBranch } = this.props

    return(
        <SModal.Main onClose={closeModal} title='Vorlage importieren' >
    			<SModal.Body>
            <fb className='importTemplateModalMain'>
              <fb className='infoText'>Welche Vorlage soll importiert werden.</fb>
              {
                templatesFlat.filter(tf => tf.branch ===  currentBranch).map(tf =>
                  <fb key={tf.id} className='tempItem' onClick={()=>this.tempClicked(tf.id)} >{tf.name}</fb>
                )
              }
            </fb>
    			</SModal.Body>
    			<SModal.Footer>
    					<SButton right label='importieren' onClick={this.importButtonClicked}/>
    			</SModal.Footer>
    		</SModal.Main>
    )
  }
}

const actionCreators = {

}

const mapStateToProps = (state: Store) => ({
  templatesFlat: state.roster.templatesFlat,
  currentBranch: state.ui.roster.currentBranch,
})

const connector: Connector<OwnProps, Props> = connect(mapStateToProps, actionCreators)
export default connector(ImportTemplateModal)
