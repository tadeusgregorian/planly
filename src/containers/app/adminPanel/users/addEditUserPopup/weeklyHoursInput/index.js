// //@flow
// import React, { PureComponent } from 'react'
// import FlatInput from 'components/flatInput'
// import _ from 'lodash'
// import moment from 'moment'
// import { withoutProp, momToSmartWeek, smartWeekToMom } from 'helpers/index.js'
// import DatePicker from 'react-datepicker';
// import cn from 'classnames'
// import 'react-datepicker/dist/react-datepicker.css';
// import './styles.css'
//
// type Props = {
//   weeklyHours: number,
//   setWeeklyHours: ({})=> any,
//   extendable: boolean
// }
//
// export default (props: props) => {
  // props: Props
  // state:  { extendButtonVisible: boolean }
  // state = { extendButtonVisible: false }

  // isMultirow = () => _.keys(this.props.weeklyHours).length > 1
  // smartWeeksArray = () => _.keys(this.props.weeklyHours).sort().reverse()
  // dateBeforeLast = () => this.smartWeeksArray()[this.smartWeeksArray().length - 2]
  // latestCreatedDate = () => _.max(this.smartWeeksArray())
  //
  // mouseOver = () => this.setState({ extendButtonVisible: true })
  // mouseOut = () => this.setState({ extendButtonVisible: false })
  //
  // extendWeeklyHours = (extension: {}) => {
  //   this.props.setWeeklyHours({ ...this.props.weeklyHours, ...extension })
  // }
  //
  // addNewRow = () => this.extendWeeklyHours({[this.nextAvailableDate()]: ''})
  //
  // deleteLastEntry = () => this.props.setWeeklyHours(withoutProp(this.props.weeklyHours, this.latestCreatedDate()))
  // replaceLastDate = (newDate: string | number, newValue: number | string) => {
  //   const withoutLast = withoutProp(this.props.weeklyHours, this.latestCreatedDate())
  //   this.props.setWeeklyHours({ ...withoutLast, [newDate.toString()]: newValue })
  // }

  // dateAllowed = (date: moment) => {
  //   if(date.weekday() !== 0) return false
  //   if(date.diff(smartWeekToMom(this.dateBeforeLast()), 'days') <= 6) return false
  //   return true
  // }
  //
  // nextAvailableDate = (): number => {
  //   const latestMom = smartWeekToMom(this.latestCreatedDate())
  //   const nextAvailableMom = latestMom.add(7, 'days')
  //   return momToSmartWeek(nextAvailableMom)
  // }
  //
  // renderExtendButton = () => (
  //   <fb className="extendButton lightButton" onClick={this.addNewRow}>
  //     <fb className='icon icon-arrow_drop_down' />
  //     <fb className="text">erweitern</fb>
  //   </fb>
  // )
  //
  // renderRemoveButton = () => (
  //   <fb className='icon removeButton icon-delete lightButton' onClick={this.deleteLastEntry}/>
  // )
  //
  // const renderSinglerow = () => {
  //   return(
  //     <fb className="inputWrapper">
  //       <FlatInput value={startWeeklyHours} onInputChange={(inp) => setWeeklyHours({[startDate]: inp})} defaultText='z.B. 40'/>
  //     </fb>
  //   )
  // }

  // renderMultirow = () => {
  //   const { weeklyHours } = this.props
  //   return(
  //     <fb className='inputWrapper'>
  //       { _.keys(weeklyHours).map((smartWeek, i) => {
  //
  //         return (
  //           <fb className='weeklyHoursRow' key={smartWeek}>
  //             <fb className='dateInfo' >
  //               <fb className='dateInfoText'>ab dem</fb>
  //               <fb className='datePickerWrapper'>
  //                 <DatePicker
  //                   selected={smartWeekToMom(smartWeek)}
  //                   onChange={(newSW) => this.replaceLastDate(momToSmartWeek(newSW), weeklyHours[smartWeek])}
  //                   filterDate={this.dateAllowed}
  //                   disabled={(smartWeek !== this.latestCreatedDate())}
  //                   className={cn({datePicker: true, active: smartWeek === this.latestCreatedDate()})}
  //                 />
  //               </fb>
  //             </fb>
  //             <FlatInput
  //               value={weeklyHours[smartWeek]}
  //               onInputChange={(inp) => this.extendWeeklyHours({[smartWeek]: inp})}
  //               autoFocus={(smartWeek === this.latestCreatedDate() && this.state.extendButtonVisible)}
  //             />
  //           </fb>
  //       )})}
  //     </fb>
  //   )
  // }

//   render = () => {
//     return(
//       <fb className="weeklyHoursInputMain">
//         { renderSinglerow() }
//         {/* <fb className='actionButtons'>
//           { this.isMultirow() && this.state.extendButtonVisible && this.renderRemoveButton() }
//           { this.props.extendable && this.state.extendButtonVisible && this.renderExtendButton() }
//         </fb> */}
//       </fb>
//     )
//   }
// }
