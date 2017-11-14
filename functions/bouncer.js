const express = require('express')
const app = express();
const cookieParser = require('cookie-parser')();
const path = require('path');

module.exports = () => {
  const validateFirebaseIdToken = (req, res, next) => {
    const __session = req.cookies.__session;

    if(__session && __session === 'loggedin_mobile') res.redirect('/mob')
    if(__session && __session === 'loggedin_desktop') res.redirect('/app')

    res.redirect('/web')


  app.use(cookieParser);
  app.use(validateFirebaseIdToken);

  return app
}
