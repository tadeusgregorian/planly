import React from 'react'
import SModal from 'components/sModal'
import SButton from 'components/sButton'
import './styles.css'

export default ({acceptBtnLabel, declineBtnLabel, onClose, onAccept, title, text, acceptBtnRed, noDecline}) => {
	const acceptBtnColor = acceptBtnRed ?  '#e74c3c' : '#2ecc71'
	const closeAndAccpet = () => {
		onAccept()
		onClose()
	}

	return(
		<SModal.Main {...{onClose, title}} >
			<SModal.Body>
				<fb className="confirmPopupBodyContent">
					{text}
				</fb>
			</SModal.Body>
			<SModal.Footer>
				 {!noDecline && <SButton label={declineBtnLabel} onClick={onClose}/>}
					<SButton right color={acceptBtnColor} label={acceptBtnLabel} onClick={closeAndAccpet}/>
			</SModal.Footer>
		</SModal.Main>
	)
}
