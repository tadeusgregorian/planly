
const functions = require('firebase-functions')

// exports.sendEmailInvites = functions.database
//   .ref('/emailInvites/{inviteID}')
//   .onWrite(event => {
//     if(!event.data.exists()) return
//     const invite = event.data.val()
//     if(invite.status !== 'pending') return
//     console.log('Sending Email TO ' + invite.email + ' with name ' + invite.name)
//     return
//   })

const trimAbsence = (a) => {
  return {
    id: a.id,
    user: a.user,
    type: a.type,
    workDays: a.workDays,
    useAvgHours: a.useAvgHours,
    avgHours: a.avghours,
    startWeekDay: a.startWeekDay,
    endWeekDay: a.endWeekDay,
    startWeek: a.startWeek,
    endWeek: a.endWeek,
  }
}

const _values = (obj) => { // cause Object.values doesnt work with this node version...
  let arr = []
  for(let key in obj){ arr.push(obj[key])}
  return arr
}

const getAbsFanOutPath = (accountID, smartWeek, absenceID) =>
  `/accounts/${accountID}/absencePlaner/absencesWeekly/${smartWeek}/${absenceID}`

const getPathToMiniShifts = (accountID, weekID, userID) =>
  `/accounts/${accountID}/roster/miniShiftWeeks/${weekID}/${userID}`

const getPathToAbsences = (accountID, weekID, userID) =>
  `/accounts/${accountID}/absencePlaner/absencesWeekly/${weekID}`

const getPathToWeekSums = (accountID, userID, weekID) =>
  `/accounts/${accountID}/roster/weekSums/${userID}/${weekID}`

exports.absenceFanOut = functions.database
  .ref('/accounts/{accountID}/absencePlaner/absences/{absenceID}')
  .onWrite(event => {
    const accountID   = event.params.accountID
    const absencePrev = event.data.previous.val()
    const absenceNew  = event.data.val()
    const isAbsenceRequest = absenceNew && absenceNew.status === 'requested'
    if(isAbsenceRequest) return // we dont care if its just requests -> we just handle accepted absences

    const touchingWeeksPrev = (absencePrev && absencePrev.touchingWeeks && Object.keys(absencePrev.touchingWeeks)) || []
    const touchingWeeksNew  = (absenceNew  && absenceNew.touchingWeeks  && Object.keys(absenceNew.touchingWeeks)) || []

    const removedWeeks = []
    touchingWeeksPrev.forEach(w => { if(!touchingWeeksNew.includes(w)) removedWeeks.push(w) })

    const updates = {}
    touchingWeeksNew.forEach(w => { updates[getAbsFanOutPath(accountID, w, absenceNew.id)] = trimAbsence(absenceNew) })
    removedWeeks.forEach(w     => { updates[getAbsFanOutPath(accountID, w, absencePrev.id)] = null })

    const rootRef = event.data.ref.root
    return rootRef.update(updates)
  })

exports.weekSumsUpdater = functions.database
  .ref('/accounts/{accountID}/roster/miniShiftWeeks/{weekID}/{userID}/{shiftID}')
  .onWrite(event => {
    const { accountID, weekID, userID }   = event.params
    const rootRef = event.data.adminRef.root
    return updater(rootRef, { accountID, weekID, userID })
  })




// target should have: accountID, weekID, userID
const updater = (rootRef, target) => {
  const { accountID , weekID, userID } = target
  const shifts_pr =   rootRef.child(getPathToMiniShifts(accountID, weekID, userID)).once('value')
  const absences_pr = rootRef.child(getPathToAbsences(accountID, weekID, userID)).orderByChild('user').equalTo(userID).once('value')

  return Promise.all([shifts_pr, absences_pr]).then(results => {

    const miniShifts = results[0].val()
    const absences   = results[1].val()

    const week = parseInt(weekID.substr(4), 10)
    const WEEK = ['mo','tu','we','th','fr','sa','su']
    let minsGrid = [0, 0, 0, 0, 0, 0, 0] // holds the sum of worked minutes per WeekDay ( every index represents the corresponding weekday )

    miniShifts && _values(miniShifts).forEach(ms => minsGrid[ms.weekDay] += ms.mins )

    console.log(miniShifts);
    console.log(minsGrid);

    const minsGridFinal = minsGrid.map((mins, weekDay) => {
      const vacToApply =  absences && _values(absences).find(a => {
        if(!a.useAvgHours) return false
        if(a.startWeek === week && a.startWeekDay > weekDay) return false
        if(a.endWeek   === week && a.endWeekDay   < weekDay) return false
        return true
      })
      if(!vacToApply) return mins // no vacation to effect the minutes this day ( already over / didnt start yet / useAvgHours is false )
      return vacToApply.workDays[WEEK[weekDay]] ? vacToApply.avgHours * 60 : 0 // zero mins -> if its a day thats not marked as workday in prefs
    })

    console.log(minsGridFinal);

    const minsSum = minsGridFinal.reduce((acc, val) => val + acc, 0)

    console.log(minsSum);

    return rootRef.child(getPathToWeekSums(accountID, userID, weekID)).set(minsSum)
  })
}
