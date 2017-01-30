require('./api/data/db.js');
var express = require('express');
var app = express();
var session = require('express-session');
var routesBack = require('./api/routes/index');
var routesFront = require('./api/routes/routespublic');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var path = require('path');


app.use(session({
  secret:'supersecret',
  resave: true,
  saveUninitialized: true,
  httpOnly: false,
  secure: false
}));

// Add middleware to console log every requests
app.use(function(req, res, next) {
  console.log(req.method, req.url);
  // Si on essaye d'accéder à la home sans session
  console.log(req.path);
  if(!req.session.name && (req.path === '/hotels/html' || req.path === '/hotels')) {

    res.redirect(302, '/');
    // On redirige vers la connexion
  }
  next();
});

// Set static directory before defining routes
app.use(express.static(path.join(__dirname, 'public')));
app.use('/node_modules', express.static(__dirname + '/nodes_modules'));
app.use('/fonts', express.static(__dirname + '/fonts'));

//Enable parsing of posted forms
app.use(bodyParser.urlencoded({ extended : false}));
app.use(bodyParser.json());

// Add some routing
app.use('/api', routesBack);
app.use('/', routesFront);

// Define the port to run on
var port = 3000;
app.listen(port, function() {
  console.log('Prêt sur http://localhost: ' + port);
});
