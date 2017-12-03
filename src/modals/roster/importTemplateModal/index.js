//@flow
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import cn from 'classnames'
import type { Connector } from 'react-redux'
import type { Store, TemplateFlat } from 'types/index'
import { importTemplateWeek } from 'actions/roster/template'

import SModal from 'components/sModal'
import SButton from 'components/sButton'
import './styles.css'

type OwnProps = {
  closeModal: ActionCreator
}
type ConProps = {
  templatesFlat: Array<TemplateFlat>,
  currentBranch: string,
  importTemplateWeek: (tempID: string)=>any,
}

type Props = OwnProps & ConProps

type State = {
  selectedTempID: ?string,
  loading: boolean,
}

class ImportTemplateModal extends PureComponent {
  props: Props
  state: State

  constructor(props:Props){
    super(props)

    this.state = {
      selectedTempID: null,
      loading: false,
    }
  }


  importButtonClicked = () => {
    const { selectedTempID } = this.state
    if(selectedTempID){
      this.setState({ loading: true })
      this.props.importTemplateWeek(selectedTempID)
      .then(() => this.props.closeModal())
    }
  }

  tempClicked = (tempID: string) => {
    const { selectedTempID } = this.state
    const newTempID = selectedTempID === tempID ? null : tempID
    this.setState({selectedTempID: newTempID})
  }

  render(){
    const { closeModal, templatesFlat, currentBranch } = this.props
    const { loading, selectedTempID } = this.state
    const buttonDisabled = !selectedTempID || loading

    return(
        <SModal.Main onClose={closeModal} title='Vorlage importieren' >
    			<SModal.Body>
            <fb className='importTemplateModalMain'>
              <fb className='infoText'>{ loading ? 'loading...' : 'Welche Vorlage soll importiert werden?' }</fb>
              {
                templatesFlat.filter(tf => tf.branch ===  currentBranch).map(tf =>
                  <fb
                    key={tf.id}
                    className={cn({tempItem: 1, selected: tf.id === selectedTempID })}
                    onClick={()=>this.tempClicked(tf.id)}
                  >{tf.name}</fb>
                )
              }
            </fb>
    			</SModal.Body>
    			<SModal.Footer>
    					<SButton right label='importieren' disabled={buttonDisabled} color='#2ecc71' onClick={this.importButtonClicked}/>
    			</SModal.Footer>
    		</SModal.Main>
    )
  }
}

const actionCreators = {
  importTemplateWeek
}

const mapStateToProps = (state: Store) => ({
  templatesFlat: state.roster.templatesFlat,
  currentBranch: state.ui.roster.currentBranch,
})

const connector: Connector<OwnProps, Props> = connect(mapStateToProps, actionCreators)
export default connector(ImportTemplateModal)
