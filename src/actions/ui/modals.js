export const openModal = (modalID, component, props) => ({
  type: 'OPEN_MODAL',
  payload: {
    modalID,
    component,
    props
  }
})

export const closeModal = (modalID) => ({
  type: 'CLOSE_MODAL',
  payload: modalID
})
