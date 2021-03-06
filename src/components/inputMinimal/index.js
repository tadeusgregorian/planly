import React from 'react'
import lockIcon from './lockIcon.png'
import emailIcon from './emailIcon.png'
import userIcon from './userIcon.png'
import './styles.css'


export default ({
	name,
	defaultText,
	password,
	email,
	onInputChange,
	onEnter,
	value,
	icon,
	imgUrl,
	iStyle,
	rounded, // gives more border-radius to the inputfield
	autoFocus,
	width,
	autocompleteOn }) => {

	const getBackgroundImage = () => {
		if(icon === 'lock') 	return 'url('+lockIcon+')'
		if(icon === 'email')	return 'url('+emailIcon+')'
		if(icon === 'user') 	return 'url('+userIcon+')'
		if(imgUrl) 						return 'url('+imgUrl+')'
		return 'none'
	}

	const getStyle = () => {
		let styleObj = { ...iStyle, backgroundImage: getBackgroundImage() }
		if(rounded) styleObj = { ...styleObj, borderRadius: 4 }
		return styleObj
	}

	const getType = () => {
		if(email) return 'email'
		if(password) return 'password'
		return 'text'
	}

	return(
		<div className='inputMinimalMain' style={{ width }}>
			<input
				value={value}
				type={getType()}
				name={name}
				style={getStyle()}
				placeholder={defaultText}
				onChange={(e)=> onInputChange(e.target.value)}
				onKeyDown={(e)=> { if(e.key === 'Enter') onEnter && onEnter() }}
				autoFocus={!!autoFocus}
				autoComplete={autocompleteOn ? 'on' : 'new-password'}
			/>
		</div>
	)
}
