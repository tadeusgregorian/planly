// cant use flow here cause its so complicated with the props / types flowing through the switch case ...
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import type { Connector } from 'react-redux'
import { closeModal } from 'actions/ui'
import type { Store } from 'types/index'
import ShiftNoteModal       from 'modals/shiftNoteModal'
import AbsenceModal         from 'modals/absenceModal'
import AddEditBranchPopup   from 'modals/addEditBranchPopup'
import AddEditPositionPopup from 'modals/addEditPositionPopup'
import AddEditUserPopup     from 'modals/addEditUserPopup'
import ExtraHoursModal      from 'modals/extraHoursModal'
import ImportTemplateModal  from 'modals/importTemplateModal'
import InitialOvertimeModal from 'modals/initialOvertimeModal'
import SaveAsTemplateModal  from 'modals/saveAsTemplateModal'
import CreateTemplateModal  from 'modals/createTemplateModal'
import DayNoteModal         from 'modals/dayNoteModal'

import './styles.css'

type Props = {
  modals: Array<{modalID: string, props?: {}}> ,
  closeModal: (modalID: string)=>any
}

class ModalsManager extends PureComponent {

  generateProps = (modal) => ({
    ...modal.props,
    key: modal.modalID,
    closeModal: () => this.props.closeModal(modal.modalID)
  })

  render = () => {

    return (
      <fb className="modalsMangarMain">
        { this.props.modals.map(m => {
          const props = this.generateProps(m)
          switch (m.modalID){
            case 'SHIFT_NOTE'           : return <ShiftNoteModal { ...props } />
            case 'ABSENCE'              : return <AbsenceModal { ...props } />
            case 'ADD_EDIT_BRANCH'      : return <AddEditBranchPopup { ...props } />
            case 'ADD_EDIT_POSITION'    : return <AddEditPositionPopup { ...props } />
            case 'ADD_EDIT_USER'        : return <AddEditUserPopup { ...props } />
            case 'EXTRA_HOURS'          : return <ExtraHoursModal { ...props } />
            case 'IMPORT_TEMPLATE'      : return <ImportTemplateModal { ...props } />
            case 'INITIAL_OVERTIME'     : return <InitialOvertimeModal { ...props } />
            case 'SAVE_AS_TEMPLATE'     : return <SaveAsTemplateModal { ...props } />
            case 'CREATE_NEW_TEMPLATE'  : return <CreateTemplateModal { ...props } />
            case 'DAY_NOTE'             : return <DayNoteModal { ...props } />
            default: return null
          }
        })}
      </fb>
    )
  }
}



const actionCreators = { closeModal }
const mapStateToProps = (state: Store) => ({ modals: state.ui.modals })

const connector: Connector<{}, Props> = connect(mapStateToProps, actionCreators)
export default connector(ModalsManager)
