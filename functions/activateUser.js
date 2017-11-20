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

    const ref = admin.database().ref(`accounts/${accID}/users/${userID}`)
    return ref.once('value').then(snap => {

      const user = snap.val() && JSON.stringify(snap.val())
      if(!user) res.sendStatus(404)

      return res.json(user)
    })
  })

  return app
}
