const functions       = require('firebase-functions')
const sumsUpdater     = require('./sumsUpdater')
const absenceHandler  = require('./absenceHandler')
const invites         = require('./invites')

exports.absenceFanOut = functions.database
  .ref('/accounts/{accountID}/absencePlaner/absences/{absenceID}')
  .onWrite(event => {
    const accountID   = event.params.accountID
    const absencePrev = event.data.previous.val()
    const absenceNew  = event.data.val()
    const rootRef     = event.data.adminRef.root
    return absenceHandler.fanOutAbsence(rootRef, { accountID, absencePrev, absenceNew })
  })

exports.miniShiftsChanged = functions.database
  .ref('/accounts/{accountID}/roster/miniShiftWeeks/{weekID}/{userID}/{shiftID}')
  .onWrite(event => {
    const { accountID, weekID, userID } = event.params
    const rootRef = event.data.adminRef.root
    return sumsUpdater.updateWeekSums(rootRef, { accountID, weekID, userID })
  })

exports.absencesWeeklyChanged = functions.database
  .ref('/accounts/{accountID}/absencePlaner/absencesWeekly/{weekID}/{absenceID}')
  .onWrite(event => {
    const { accountID, weekID } = event.params
    const { user } = event.data.val() || event.data.previous.val()
    const rootRef = event.data.adminRef.root
    return sumsUpdater.updateWeekSums(rootRef, { accountID, weekID, userID: user })
  })

exports.getInviteStatus = functions.https.onRequest(invites.getInviteStatus)
