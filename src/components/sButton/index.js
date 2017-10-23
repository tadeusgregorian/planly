import React from 'react'
import './styles.css'

export default ({label, disabled, onClick, color, sStyle, right, left, tabInd, slick, grey, icon, iconStyle, mini}) => {
	const colorStyle = {
		color: 'white',
		backgroundColor: color,
		border: 'none'
	}

	const greyStyle = {
		color: '#848484',
    background: '#fbfbfb',
    border: '1px solid #bfbfbf',
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

	const miniStyle = {
		fontSize: 12,
		height: 28,
		paddingLeft: 12,
		paddingRight: 12,
		minWidth: 90,
	}

	const getStyle = () => {
		let styleObj = {}

		// styleObj is modified in this order.
		if(slick)  	 styleObj = { ...slickStyle }
		if(color) 	 styleObj = { ...styleObj, ...colorStyle }
		if(grey) 	   styleObj = { ...styleObj, ...greyStyle }
		if(disabled) styleObj = { ...styleObj, ...disabledStyle }
		if(mini)		 styleObj = { ...styleObj, ...miniStyle }
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
			onClick={disabled ? null : onClick}
			tabIndex={tabInd}
		>
			{icon && <fb style={getIconStyle()} className={icon + ' icon sButtonIcon'}/>}
			{label}
		</fb>
	)
}
