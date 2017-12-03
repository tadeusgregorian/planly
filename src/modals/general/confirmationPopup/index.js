import React from 'react'
import SModal from 'components/sModal'
import SButton from 'components/sButton'
import './styles.css'

export default ({acceptBtnLabel, declineBtnLabel, closeModal , onAccept, title, text, acceptBtnRed, noDecline}) => {
	const acceptBtnColor = acceptBtnRed ?  '#e74c3c' : '#2ecc71'

	const closeAndAccpet = () => {
		onAccept()
		closeModal()
	}

	const acceptLabel = acceptBtnLabel || 'OK'
	const declineLabel = declineBtnLabel || 'Abbrechen'

	return(
		<SModal.Main onClose={closeModal} title={title} >
			<SModal.Body>
				<fb className="confirmPopupBodyContent">
					{text}
				</fb>
			</SModal.Body>
			<SModal.Footer>
				 {!noDecline && <SButton label={declineLabel} onClick={closeModal} mini right />}
					<SButton color={acceptBtnColor} label={acceptLabel} onClick={closeAndAccpet} mini />
			</SModal.Footer>
		</SModal.Main>
	)
}
