//@flow
import React from 'react'
import './styles.css'

type PropsMain = {
	title: string,
	children: any,
	onClose: Function,
	unclosable: ?boolean | ?string,
	className: ?string,
}

const SModalMain = ({title, children, onClose, unclosable, className}: PropsMain) => (
	<fb className={'sModalContainer' + (className ? ' ' + className: '')}>
		<fb className='sModalMain'>
			<fb className='sModalHead'>
				<fb className='sModalTitle'><span className="titleSpan">{title}</span></fb>
				{ !unclosable && <fb className='sModalX' onClick={onClose}><fb className='icon icon-close'/></fb> }
				</fb>
			{children}
		</fb>
	</fb>
)

const SModalBody = ({children, style}: {children: any, style: {}} ) => (
	<fb className='sModalBody' style={style}>{children}</fb>
)

export const SModalFooter = ({children, style}: {children: any, style: {}} ) => (
	<fb className='sModalFooter' style={style}>{children}</fb>
)

export default {Main: SModalMain, Body: SModalBody, Footer: SModalFooter}
