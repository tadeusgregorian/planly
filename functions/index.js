const functions = require('firebase-functions')

exports.sendEmailInvites = functions.database
  .ref('/emailInvites/{inviteID}')
  .onWrite(event => {
    if(!event.data.exists()) return
    const invite = event.data.val()
    if(invite.status !== 'pending') return
    console.log('Sending Email TO ' + invite.email + ' with name ' + invite.name)
  })
