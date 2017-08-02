import React from 'react'
import lockIcon from './lockIcon.png'
import emailIcon from './emailIcon.png'
import userIcon from './userIcon.png'
import './styles.css'


export default (props) => {

	const getBackgroundImage = () => {
		if(props.icon === 'lock') 	return 'url('+lockIcon+')'
		if(props.icon === 'email')	return 'url('+emailIcon+')'
		if(props.icon === 'user') 	return 'url('+userIcon+')'
		if(props.imgUrl) 						return 'url('+props.imgUrl+')'
		return 'none'
	}

	const getStyle = () => ({
		...props.iStyle,
		backgroundImage: getBackgroundImage()
	})

	const {name, defaultText, password, onInputChange, onEnter, value} = props
	return(
		<div className='inputMinimalMain'>
			<input
				value={value}
				type={password ? "password" : "text"}
				name={name}
				style={getStyle()}
				placeholder={defaultText}
				onChange={(e)=> onInputChange(e.target.value)}
				onKeyDown={(e)=> { if(e.key === 'Enter') onEnter && onEnter() }}
				autoFocus={props.autoFocus}
				autoComplete={props.autocompleteOn ? 'on' : 'new-password'}
			/>
		</div>
	)
}
