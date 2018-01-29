/**
 * Module dependencies.
 */

var mongoose = require('mongoose');
var LocalStrategy = require('passport-local').Strategy;
var user = mongoose.model('user');
var Session = mongoose.model('Session');
var jwt = require('jsonwebtoken');
var sessionSecret="thisisareallylongsessionsecretandyoucanchangeitbutletitbelongggggg"
/**
 * Expose
 */
console.log("a");

module.exports = new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
  },
  function(email, password, done) {
    console.log("email",email);
    var options = {
      criteria: { email: email },
      select: 'name about email hashed_password salt'
    };
    user.load(options, function (err, user) {
      if (err) return done(err)
      if (!user) {
        return done(null, false, { message: 'Unknown user' });
      }
      if (!user.authenticate(password)) {
        return done(null, false, { message: 'Invalid password' });
      }

      //create session here.
      Session.findOne({user:user._id})
      .lean()
      .exec(function(err,session){
        if(session){
          var token = jwt.sign({_id:String(user._id),firstname:user.firstname,lastname:user.lastname,email:user.email},sessionSecret);
          Session.findOneAndUpdate({_id:session._id},{token:token})
          .lean()
          .exec(function(err,session1){
            
              console.log('session=====',token);
              return done(null, user,{
                sessionToken:token,
                sessionId:session1._id
              }); 
          });       
        }
        else{

          var token = jwt.sign({_id:String(user._id),firstname:user.firstname,lastname:user.lastname,email:user.email},sessionSecret);
          var newSession = new Session({
            user : user._id,
            token:token
          });
          newSession.save();
          return done(null, user,{
            sessionToken:newSession.token,
            sessionId:newSession._id
          }); 
        }
      });
    });
  }
);