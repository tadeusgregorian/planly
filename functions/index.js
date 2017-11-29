const functions       = require('firebase-functions')

const getUser             = require('./getUser')
const activateUser        = require('./activateUser')
const sendInvitationMail  = require('./mailSender')
const admin               = require('firebase-admin')
admin.initializeApp(functions.config().firebase)

exports.onEmailInviteAdded = functions.database
  .ref('/emailInvites/{inviteID}')
  .onWrite(event => {
    const rootRef = event.data.adminRef.root
    const { inviteID } = event.params
    const { status, accountID, name, url, email } = event.data.val()
    if(status !== 'PENDING') return
    return sendInvitationMail({ rootRef, inviteID, accountID, name, url, email })
  })

exports.getUser = functions.https.onRequest(getUser(admin))
exports.activateUser = functions.https.onRequest(activateUser(admin))
