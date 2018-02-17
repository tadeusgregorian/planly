const functions       = require('firebase-functions')

const sumsUpdater         = require('./sumsUpdater')
const getUser             = require('./getUser')
const activateUser        = require('./activateUser')
const sendInvitationMail  = require('./mailSender')
const absenceHandler      = require('./absenceHandler')
const admin               = require('firebase-admin')
admin.initializeApp(functions.config().firebase)

exports.absenceFanOut = functions.database
  .ref('/accounts/{accountID}/absencePlaner/absences/{absenceID}')
  .onWrite(event => {
    const accountID   = event.params.accountID
    const absencePrev = event.data.previous.val()
    const absenceNew  = event.data.val()
    const rootRef     = event.data.adminRef.root
    return absenceHandler.fanOutAbsence(rootRef, { accountID, absencePrev, absenceNew })
  })

  exports.absencesWeeklyChanged = functions.database
  .ref('/accounts/{accountID}/absencePlaner/absencesWeekly/{weekID}/{absenceID}')
  .onWrite(event => {
    const { accountID, weekID } = event.params
    const { user } = event.data.val() || event.data.previous.val()
    const rootRef = event.data.adminRef.root
    return sumsUpdater.updateWeekSums(rootRef, { accountID, weekID, userID: user })
  })

exports.onEmailInviteAdded = functions.database
  .ref('/emailInvites/{inviteID}')
  .onWrite(event => {
    const rootRef = event.data.adminRef.root
    const { inviteID } = event.params
    const { status, accountID, name, url, email } = event.data.val()
    if(status !== 'PENDING') return false
    return sendInvitationMail({ rootRef, inviteID, accountID, name, url, email })
  })

exports.getUser = functions.https.onRequest(getUser(admin))
exports.activateUser = functions.https.onRequest(activateUser(admin))
