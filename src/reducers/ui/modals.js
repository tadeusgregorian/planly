//@flow
export type Modal = {
  modalID: string,
  component: Class<React$Component<*, *, *>>,
  props?: {}
}

export type Modals = Array<Modal>
const modals = (state: Modals = [], action: any): Modals => {

  if(action.type === 'OPEN_MODAL') { return [
    ...state, {
      modalID: action.payload.modalID,
      component: action.payload.component,
      props: action.payload.props
    }
  ]}

  if(action.type === 'CLOSE_MODAL') {
    return state.filter(modal => modal.modalID !== action.payload )
  }
  return state
}

export default modals
