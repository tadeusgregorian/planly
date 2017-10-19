//@flow

import React from 'react'
import './styles.css'

type Props = {
	name?: string,
	defaultText?: string,
	password?: any,
	onInputChange: (string)=>any,
	onEnter?: Function,
	value: ?string | number,
	iStyle?: {},
	maxLength?: number | string,
	autoFocus?: any,
}


export default ({
	name,
	defaultText,
	password,
	onInputChange,
	onEnter,
	value,
	iStyle,
	maxLength,
	autoFocus }: Props) => {

	return(
		<fb className='flatInputMain'>
			<input
				value={value}
				type={password ? "password" : "text"}
				name={name}
				maxLength={maxLength && maxLength.toString()}
				style={iStyle && iStyle}
				placeholder={defaultText}
				onChange={(e)=> onInputChange(e.target.value)}
				onKeyDown={(e)=> { if(e.key === 'Enter') onEnter && onEnter() }}
				autoFocus={autoFocus}
			/>
		</fb>
	)
}
