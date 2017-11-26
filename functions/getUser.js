const express = require('express')
const app = express();


module.exports = (admin) => {

  app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

  app.get('/api/get-invited-user/:inviteID', (req, res)=> {

    const inviteID  = req.params.inviteID

    if(!inviteID){
      console.log('here?');
      res.sendStatus(404)
      throw new Error('Something wrong: inviteID:' + inviteID )
    }

    const inviteRef = admin.database().ref(`emailInvites/${inviteID}`)
    return inviteRef.once('value').then(snap => {

      const invite = snap.val()
      console.log(invite);

      if(!invite) res.sendStatus(404)
      const { userID, accountID }  = invite

      const userRef = admin.database().ref(`accounts/${accountID}/users/${userID}`)
      return userRef.once('value').then(snap => {

        const user = snap.val() && JSON.stringify(snap.val())
        if(!user) res.sendStatus(404)

        return res.json(user)
      }).catch(e => console.log(e))
    }).catch(e => console.log(e))
  })


  return app
}
