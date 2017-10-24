//@flow
export type Modal = {
  modalID: string,
  props?: {}
}

export type Modals = Array<Modal>
const modals = (state: Modals = [], action: any): Modals => {

  if(action.type === 'OPEN_MODAL') { return [
    ...state, {
      modalID: action.payload.modalID,
      props: action.payload.props
    }
  ]}

  if(action.type === 'CLOSE_MODAL') {
    return state.filter(modal => modal.modalID !== action.payload )
  }
  return state
}

export default modals
