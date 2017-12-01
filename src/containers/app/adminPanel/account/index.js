// //@flow
// import React from 'react'
// import cn from 'classnames'
// import { connect } from 'react-redux'
// import type { Connector } from 'react-redux'
// import type { Store, AccountPreferences } from 'types/index'
// import SCheckbox from 'components/sCheckbox'
// import { saveWorkdaysPerWeek, saveUseAvgHoursForVac } from 'actions/accountDetails'
// import './styles.css'
//
// type Props = {
//   preferences: AccountPreferences
// }
//
// const Account = (props: Props) => {
//
//   const { workdaysPerWeek, useAvgHoursForVac } = props.preferences
//   const clicked5Days = () => workdaysPerWeekClicked(5)
//   const clicked6Days = () => workdaysPerWeekClicked(6)
//
//   const workdaysPerWeekClicked = (days: number) => {
//     workdaysPerWeek !== days && saveWorkdaysPerWeek(days)
//   }
//
//   const changeUseAvgHoursForVac = () => {
//     saveUseAvgHoursForVac(!useAvgHoursForVac)
//   }
//
//
//   return(
//     <fb className="adminPanelConfigurationsMain">
//       <fb className="headline">Account-Einstellungen</fb>
//       <fb className='content'>
//         <fb className='row'>
//           <fb className='rowLabel'>Anzahl der Arbeitstage pro Woche:</fb>
//           <fb className='rowMain'>
//             <fb className={cn({soBtn: 1, weekDaysBtn: 1, disabled: workdaysPerWeek !== 5})} onClick={clicked5Days}>5 Tage Woche</fb>
//             <fb className={cn({soBtn: 1, weekDaysBtn: 1, disabled: workdaysPerWeek !== 6})} onClick={clicked6Days}>6 Tage Woche</fb>
//           </fb>
//         </fb>
//         <fb className='row'>
//           <fb className='cb'><SCheckbox isChecked={!!useAvgHoursForVac} onCheck={changeUseAvgHoursForVac} /></fb>
//           <fb className='rowLabel' style={{ width: 448}}>Im Urlaub dem Mitarbeiter Durschnitts-Tagesstunden Gutschreiben.</fb>
//         </fb>
//       </fb>
//     </fb>
//   )
// }
//
// const actionCreators = {
//
// }
//
// const mapStateToProps = (state: Store) => ({
//   preferences: state.core.accountDetails.preferences
// })
//
// const connector: Connector<*, Props> = connect(mapStateToProps, actionCreators)
// export default connector(Account)
