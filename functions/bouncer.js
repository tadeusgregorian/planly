const express = require('express')
const app = express();
const cookieParser = require('cookie-parser')();
const path = require('path');

module.exports = () => {

  const handleRequest = (req, res, next) => {
    const __session = req.cookies.__session;

    console.log('Session Coockie is: ', __session);

    if(__session && __session === 'loggedin_mobile')  res.redirect('/mob/')
    if(__session && __session === 'loggedin_desktop') res.redirect('/app/')

    console.log('delivering WEB now!');

    res.sendFile(path.join(__dirname + '/website/index.html'))
  }

  app.use(cookieParser);
  app.use(handleRequest);

  return app
}
