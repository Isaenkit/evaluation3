var express = require('express');
var router = express.Router();
var path = require('path');

// Authentication and Authorization Middleware
var auth = function(req, res, next) {
  if (req.session && req.session.name)
    return next();
  else
    return
    res.sendStatus(401);
};

//////////////////////////////////////
/// Router pour les pages publics  ///
//////////////////////////////////////

var ctrlAuthentification = require('./../controllers/users.controllers.js');

router
  .route('/login')
  .post(ctrlAuthentification.login);

router
  .route('/inscription')
  .post(ctrlAuthentification.inscription);

router
  .route('/logout')
  .get(ctrlAuthentification.logout);

router
  .route('/hotels')
  .get(auth, function(req,res){
    res.sendFile(path.join(__dirname, '../../public', 'hotels.html'));
  });
router
  .route('/login')
  .get(function(req,res){
    res.sendFile(path.join(__dirname, '../../public', 'login.html'));
  });
router
  .route('/register')
  .get(function(req, res){
    res.sendFile(path.join(__dirname, '../../public', 'register.html'));
  });

  module.exports = router;
