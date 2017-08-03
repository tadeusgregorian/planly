import React from 'react'
import './styles.css'

const SModalMain = ({title, children, onClose}) => (
	<fb className="sModalContainer">
		<fb className='sModalMain'>
			<fb className='sModalHead'>
				<fb className='sModalTitle'><span className="titleSpan">{title}</span></fb>
				<fb className='sModalX' onClick={onClose}><icon className='icon-close'/></fb>
				</fb>
			{children}
		</fb>
	</fb>
)

const SModalBody = ({children, style}) => (
	<fb className='sModalBody' style={style}>{children}</fb>
)

export const SModalFooter = ({children, style}) => (
	<fb className='sModalFooter' style={style}>{children}</fb>
)

export default {Main: SModalMain, Body: SModalBody, Footer: SModalFooter}
