// i think i dont need this: -> Bundesland will be selected during Registration.
//
// //@flow
// import React, { PureComponent } from 'react'
// import { connect } from 'react-redux'
// import type { Connector } from 'react-redux'
// import { bundeslandOptions } from 'constants/general'
// import { saveAbsenceSettings } from 'actions/accountDetails'
// import Dropdown from 'react-dropdown'
//
// import SModal   from 'components/sModal'
// import SButton  from 'components/sButton'
// import type { BundeslandCode, AccountPreferences } from 'types/index'
//
// import './styles.css'
//
// type OwnProps = {
//   closeModal: Function
// }
//
// type ConProps = {
//   preferences: AccountPreferences
// }
//
// type Props = OwnProps & ConProps
//
// type State = {
//   bundesland: BundeslandCode | false,
//   loading: boolean,
// }
//
// class AbsenceSettingsModal extends PureComponent{
//   state: State
//   props: Props
//
//   constructor(props: Props){
//     super(props)
//
//     const { preferences } = this.props
//
//     this.state = {
//       bundesland: preferences.bundesland,
//       loading: false,
//     }
//   }
//
//   onSubmit = () => {
//     const { bundesland } = this.state
//     this.setState({ loading: true })
//     bundesland && saveAbsenceSettings(bundesland)
//       .then(() => { this.props.closeModal() })
//   }
//
//   render(){
//     const { bundesland, loading } = this.state
//     const curBundesland = bundesland && bundeslandOptions.find(b => b.code === bundesland)
//     const name = curBundesland && curBundesland.name
//
//     return(
//       <SModal.Main onClose={this.props.closeModal} title='Urlaubsplaner Einstellung'>
//   			<SModal.Body>
//   				<fb className="absenceSettingsModalMain">
//             <fb className='section'>
//               <fb className='topic'>Bundeland:</fb>
//               <fb className='options'>
//                   <fb className='dropdownWrapper'>
//                   <Dropdown
//                     value={{value: bundesland, label: name}}
//                     options={bundeslandOptions.map(b => ({value: b.code , label: b.name }))}
//                     onChange={(opt) => this.setState({bundesland: opt.value })}
//                   />
//                 </fb>
//                 <fb className='explenation'>Zur Erfassung der gesetzlichen Feiertage</fb>
//               </fb>
//             </fb>
//   				</fb>
//           <SModal.Footer>
//             <SButton
//               label={loading ? '...' : 'speichern'}
//               disabled={!bundesland}
//               onClick={this.onSubmit}
//               color='#00a2ef' right />
//           </SModal.Footer>
//   			</SModal.Body>
//   		</SModal.Main>
//     )
//   }
// }
//
// const mapStateToProps = (state: Store) => ({
//   preferences: state.core.accountDetails.preferences
// })
//
// const connector: Connector<OwnProps, Props> = connect(mapStateToProps)
// export default connector(AbsenceSettingsModal)
