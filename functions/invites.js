const express = require('express')

const app = express();
app.get('/api/get-invite-status', (req, res)=> {
  res.send('<h3>Bro...</h3>')
})

exports.getInviteStatus = app
