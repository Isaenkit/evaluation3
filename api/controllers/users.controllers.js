var mongoose = require('mongoose');
var User = mongoose.model('users');
var path = require('path');
var crypto = require('crypto');

module.exports.login = (req, res) => {

  if(!req.body.email || !req.body.password) {
    res.send('login failed');
  } else {
    console.log(req.body);
    var email = req.body.email;
    var password = req.body.password;


    User
      .findOne({
        email : email
      })
      .exec(function(err, user){
        if (err) {
          console.log(err);
          res
            .status(500)
            .json(err);
          } else {
            if (user != null) {
              // si on trouve un utilisateur avec cet email
              var motdepasseMD5 = crypto.createHash('md5').update(password).digest("hex");

              if (motdepasseMD5 === user.password) {
          req.session.name = user.name;
          req.session.userID = user._id;
          console.log('Connection OK');
          res
            .redirect(302, '/hotels');
        } else {
                res
                .redirect(302, '/login');
              }
              } else {
                // Sinon on redirige vers la page de connection
                console.log('No user finding for this email');
                  res
                  .redirect(302, '/login');
              }
          }
        });
      }
}

module.exports.logout = (req, res) => {
  req.session.destroy();
  console.log('Logout session');
  res.redirect(302, '/');
};

module.exports.inscription = (req, res) => {
    User

      .create({
        name : req.body.name,
        email : req.body.email,
        password : crypto.createHash('md5').update(req.body.password).digest("hex")
      }, function(err, user) {
          if (err) {
            res.status(500).json(err);
          } else {
            req.session.name = user.name;
            req.session.userID = user._id;
            res
              .redirect(302, '/hotels');
          }
      });
};
