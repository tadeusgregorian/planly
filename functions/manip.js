const express = require('express')
const app = express();

module.exports = (admin) => {

  app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

  app.get('/api/manipulate', (req, res)=> {

    return admin.auth().updateUser('pTh2EqGGdTSLW6pIVbqR6iRjoNy1', {
      password: "andreas"
    })
    .then(function(userRecord) {
      res.json({great: 'success'})
    })
    .catch(function(error) {
      res.json({error: 'pain'})
    });
  })

  return app
}
