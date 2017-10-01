import React from 'react'
import './styles.css'

export default ({label, disabled, onClick, color, sStyle, right, left, tabInd, slick, icon, iconStyle}) => {
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

	const slickStyle = {
		fontSize: 15,
		height: 36,
		backgroundColor: '#009be4',
		borderColor: '#009be4',
		color: 'white',
		fontWeight: 400,
		letterSpacing: 0.5,
		textTransform: 'none',
		minWidth: 0
	}

	const getStyle = () => {
		let styleObj = {}

		// styleObj is modified in this order.
		if(slick)  	 styleObj = { ...slickStyle }
		if(color) 	 styleObj = { ...styleObj, ...colorStyle }
		if(disabled) styleObj = { ...styleObj, ...disabledStyle }
		if(sStyle)   styleObj = { ...styleObj, ...sStyle}
		if(icon)		 styleObj = { ...styleObj, paddingLeft: 8}
		if(left) styleObj.marginRight = 'auto'
		if(right) styleObj.marginLeft = 'auto'
		return styleObj
	}

	const getIconStyle = () => {
		let styleObj = {}
		if(slick || color) 	styleObj = { ...styleObj, color: 'white'}
		if(iconStyle)				styleObj = { ...styleObj, ...iconStyle }
		return styleObj
	}

	return(
		<fb
			className='sButton'
			style={getStyle()}
			onClick={!disabled && onClick}
			tabIndex={tabInd}
		>
			{icon && <fb style={getIconStyle()} className={icon + ' icon sButtonIcon'}/>}
			{label}
		</fb>
	)
}
