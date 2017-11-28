let Mailjet = require('node-mailjet').connect(
	'1017ade9d8cbc49b1dd919dad716ab36',
	'21f42711406b08417aa1a3a955284ce1'
)

module.exports = (inviteData) => {

  const { rootRef, inviteID, accountID, name, email, url } = inviteData

  //TODO: check if mail is correct Mail format!
  console.log(`user ${name} on account: ${accountID} gets mail a to ${email}`);

  let txt = ''
  txt += `Hi ${name}, \n`
  txt += `es wurde ein Zugang zum Aplano-Dienstplaner für Dich eingerichtet.\n`
  txt += `Klicke auf den folgenden Link um Deinen Account zu aktivieren:\n`
  txt += `${url}/invite/${accountID}/${inviteID} \n`
  txt += `\n`
  txt += `Mit freundlichen Grüßen \n`
  txt += `Dein Aplano Team \n`

  const sendEmail = Mailjet.post('send')
  const emailData = {
    'FromEmail':  'tadeus.gregorian@apotower.de',
    'FromName':   'Aplano Team',
    'Subject':    name + ' - Aplano Einladung',
    'Text-part':  txt,
    'Recipients': [{'Email': email}]
  }

  return sendEmail.request(emailData)
    .then((res) => {
			console.log('Main succesfully sent to: ' + email)
			rootRef.child(`emailInvites/${inviteID}/status`).set('SENT')
		})
    .catch((err) => {
      console.log('Mail sending failed: ' + err)
      return rootRef.child(`emailInvites/${inviteID}/status`).set('FAILED')
    })
}
