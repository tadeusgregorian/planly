const express = require('express')
const app = express();

module.exports = (admin) => {

  app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

  app.get('/api/activate-user/:accID/:userID/:firebaseUid', (req, res)=> {

    const { accID, userID, firebaseUid }  = req.params

    if(!accID || !userID || !firebaseUid){

      res.sendStatus(404)
      throw new Error('Something wrong: accID:' + accID + ' userID: ' + userID + 'firebaseUid: ' + firebaseUid )
    }

    const ref        = admin.database().ref()
    const userPath   = `accounts/${accID}/users/${userID}`

    return ref.child(userPath).once('value').then(snap => {
      const user  = snap.val()
      const email = user && user.email

      if(!user)   return res.sendStatus(404)
      if(!email)  return res.sendStatus(404)

      const updates = {}
      updates['/allUsers/' + firebaseUid] = { account: accID, userID, email, timestamp: admin.database.ServerValue.TIMESTAMP }
      updates[userPath + '/status'] = 'ACTIVE'

      return ref.update(updates).then(v => res.sendStatus(200))
    })
  })

  return app
}
