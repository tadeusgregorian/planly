const modals = (state = [], action) => {

  if(action.type === 'OPEN_MODAL') { return [
    ...state, {
      modalID: action.payload.modalID,
      component: action.payload.component,
      props: action.payload.props,
      blop: 'blob'
    }
  ]}

  if(action.type === 'CLOSE_MODAL') {
    return state.filter(modal => modal.modalID !== action.payload )
  }
  return []
}

export default modals
