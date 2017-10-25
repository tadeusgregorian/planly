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
	disabled?: boolean,
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
	disabled,
	autoFocus }: Props) => {

	const getStyle = () => {
		let style = {}
		iStyle   && (style = { ...style, iStyle})
		disabled && (style = { ...style, background: '#f1f1f1' })
		return style
	}

	return(
		<fb className='flatInputMain'>
			<input
				value={value}
				type={password ? "password" : "text"}
				name={name}
				maxLength={maxLength && maxLength.toString()}
				style={getStyle()}
				disabled={disabled}
				placeholder={defaultText}
				onChange={(e)=> !disabled && onInputChange(e.target.value)}
				onKeyDown={(e)=> { if(e.key === 'Enter') onEnter && onEnter() }}
				autoFocus={autoFocus}
			/>
		</fb>
	)
}
