import React from 'react'
import './styles.css'


export default ({
	name,
	defaultText,
	password,
	onInputChange,
	onEnter,
	value,
	iStyle,
	autoFocus }) => {

	return(
		<fb className='flatInputMain'>
			<input
				value={value}
				type={password ? "password" : "text"}
				name={name}
				style={iStyle && iStyle}
				placeholder={defaultText}
				onChange={(e)=> onInputChange(e.target.value)}
				onKeyDown={(e)=> { if(e.key === 'Enter') onEnter && onEnter() }}
				autoFocus={autoFocus}
			/>
		</fb>
	)
}
