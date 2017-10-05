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

const trimAbsence = (absence) => {
  const { id, user, type, startDate, endDate, excludedDays, dayRate, hollow } = absence
  return { id, user, type, startDate, endDate, excludedDays, dayRate, hollow }
}

const getAbsFanOutPath = (accountID, smartWeek, absenceID) => {
  return (`/accounts/${accountID}/absencePlaner/absencesWeekly/${smartWeek}/${absenceID}`)
}

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

    const root = event.data.ref.root
    // console.log('updates is: ')
    // console.log(updates)
    return root.update(updates)

  })
