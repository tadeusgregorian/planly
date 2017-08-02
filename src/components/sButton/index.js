import React from 'react'
import './styles.css'

export default ({label, disabled, onClick, color, sStyle, right, left, tabInd}) => {
	const colorStyle = {
		color: 'white',
		backgroundColor: color,
		border: 'none'
	}

	const disabledStyle = {
		color: '#bdbfc1',
    backgroundColor: 'rgb(231, 234, 236)',
    border: 'none',
	}

	const getStyle = () => {
		let styleObj = {}

		// styleObj is modified in this order.
		if(color) 	 styleObj = { ...colorStyle }
		if(disabled) styleObj = { ...disabledStyle }
		if(sStyle)   styleObj = { ...styleObj, ...sStyle}
		if(left) styleObj.marginRight = 'auto'
		if(right) styleObj.marginLeft = 'auto'
		return styleObj
	}

	return(
		<fb
			className='sButton'
			style={getStyle()}
			onClick={!disabled && onClick}
			tabIndex={tabInd}
		>{label}</fb>
	)
}
