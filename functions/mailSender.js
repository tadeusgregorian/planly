let Mailjet = require('node-mailjet').connect(
	'1017ade9d8cbc49b1dd919dad716ab36',
	'21f42711406b08417aa1a3a955284ce1'
)

module.exports = (inviteData) => {

  const { rootRef, accountID, userID, name, email, url } = inviteData

  //TODO: check if mail is correct Mail format!
  console.log(`user ${name} on account: ${accountID} gets mail a to ${email}`);

  let txt = ''
  txt += `Hi ${name}, \n`
  txt += `es wurde ein Zugang zum Plandy-Dienstplaner für dich eingerichtet.\n`
  txt += `Klicke auf den Folgenden link um diensen zu aktivieren und einzurichten:\n`
  txt += `${url}/invite/${accountID}/${userID}, \n`
  txt += `\n`
  txt += `Mit freundlichen Grüßen \n`
  txt += `Dein plandy Team \n`

  const sendEmail = Mailjet.post('send')
  const emailData = {
    'FromEmail':  'tadeus.gregorian@apotower.de',
    'FromName':   'Plandy Team',
    'Subject':    name + ' - Planly Einladung',
    'Text-part':  txt,
    'Recipients': [{'Email': 'tade.gregorian@gmail.com'}]
  }

  return sendEmail.request(emailData)
    .then(result => console.log(result.body))
    .catch(error => console.log(error))

}
