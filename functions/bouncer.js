const express = require('express')
const app = express();
const cookieParser = require('cookie-parser')();
const path = require('path');

module.exports = () => {

  const handleRequest = (req, res, next) => {
    const __session = req.cookies.__session;

    res.set('Cache-Control', 'public, max-age=300, s-maxage=600');

    if(__session === 'loggedin_mobile') return res.sendFile(path.join(__dirname + '/mob/index.html'))
    if(__session === 'loggedin_desktop') return res.sendFile(path.join(__dirname + '/app/index.html'))
    res.sendFile(path.join(__dirname + '/web/index.html'))

  }
  app.use(cookieParser);
  app.use(handleRequest);

  return app
}
