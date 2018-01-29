/*
Load all models here
*/
let	express = require("express"),
	app = express(),
	bodyParser = require("body-parser");
	router = express.Router(),
	assert = require('assert');
	mongoose = require('mongoose');
	user = mongoose.model('user');
	session = require('../libs/session');
	Session = mongoose.model('Session');
	jwt = require('jsonwebtoken');
	config = require('config');
	uuid = require('node-uuid');
	request = require("request");
	 multer = require('multer')
 cors = require('cors')
 passport = require('passport');
fs=require('fs');
/*
Empty HTTP method object.
*/

var methods = {};
var response = {

    success: false,
    code: "",
    data: null,
    userMessage: '',
    errors: null
};

var NullResponseValue = function() {
    response = {
        success: false,
        code: "",
        data: null,
        userMessage: '',
        errors: null
    };
    return true;
};
var SendResponse = function(res, status) {
    res.status(status || 200).send(response);
    NullResponseValue();
    return
};

var codes = function() {
    return uuid.v1();
};
var path = require('path')
var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, __dirname + '/uploads/')
    },
    filename: function(req, file, cb) {
        cb(null, uuid.v4() + '-' + Date.now() + path.extname(file.originalname))
    }
})


var upload = multer({
    storage: storage
})



/*
Routings/controller goes here
*/

module.exports = function(router) {
	router.route('/').get(function(req, res) {
        res.send(200, {
            "all": "ok"
        })
    })

    router.route('/user')
    	.post(methods.signup)
      .put(session.checkToken, upload.single('profilePic'), methods.update)
      .get(session.checkToken,methods.allUsers)

    router.route('/user/session')
        .post(methods.userLogin)
        .delete(session.checkToken, methods.userlogout)

    router.route('/ping')
        .get(session.checkToken,methods.getuser)

    router.route('/addfriends')
      .post(session.checkToken,methods.sendrequest)
      .put(session.checkToken,methods.canclereq)

    router.route('/friends')
      .post(session.checkToken,methods.acceptreq)
      .put(session.checkToken,methods.unfriend)

      router.route('/profilepic/:profileIndex')
        .get(methods.getProfilePic)


}


/**************************************************************************************************************************/
/***************************************** All the HTTP methods goes here *************************************************/
/**************************************************************************************************************************/

methods.update = function(req, res) {
  console.log("methods.update",req.file)
  console.log("req.body",req.body)
    req.checkBody('name', 'name is required.').notEmpty();
    req.checkBody('email', 'email is required, ').notEmpty().isEmail();
    req.checkBody('phone', 'phone num is required.').notEmpty().len(10)

    var errors = req.validationErrors(true);
    if (errors) {
        console.log("+++++++++++++")
        console.log("errors", errors)
        console.log("+++++++++++++")
        response.success = false;
        response.errors = errors;
        response.code = 10801;
        response.userMessage = 'something went wrong'
        return SendResponse(res, 400);
    } else {
        var profilePic = {}
        if (req.file) {
            console.log("here is your file", req.file)
            profilePic.path = req.file.path;
            profilePic.mimetype = req.file.mimetype;
            profilePic.filename = req.file.filename
        }
        user.findOneAndUpdate({
                _id: req.user._id
            }, {
                name: req.body.name,
                email: req.body.email,
                phone: req.body.phone,
                
                profilePic: profilePic

            })
            .exec(function(err, data) {

                if (err) {
                   
                    console.log("done")
                    response.success = false;
                    response.code = 10901;
                    response.userMessage = 'Oops! Our bad! The server slept while doing that, we just poured it with some coffee. Can you please try doing it again?'
                    return SendResponse(res, 500);
                } else {



                    response.success = true;
                    response.code = 200;
                    response.userMessage = 'Successfully Updated '
                    return SendResponse(res, 200);
                }
            })
    }

}


methods.getProfilePic = function(req, res) {
    console.log("??", req.param('profileIndex'))
    if (req.param('profileIndex')) {
        url = __dirname + '/uploads/' + req.param('profileIndex')

        fs.readFile(url, function(err, content) {
            if (err) {
                res.writeHead(400, {
                    'Content-type': 'text/html'
                })
                console.log(err);
                res.end("No such image");
            } else {
                //specify the content type in the response will be an image
                res.writeHead(200, {
                    'Content-type': 'image/jpg'
                });
                res.end(content);
            }
        });

    } else {
        if (req.user.profilePic.url) {
            res.send(req.user.profilePic.url)
        } else {
            res.send()
        }
    }
}


methods.unfriend=function(req,res){
  console.log("unfriend",req.body)
   req.checkBody('userId', 'userId is required.').notEmpty();
    var errors = req.validationErrors(true);
    if (errors) {
      console.log("here-----")
        response.success = false;
        response.code = 10801;
        response.errors = errors;
        response.userMessage = 'Validation errors';
        return SendResponse(res, 400);
    } else {
      user.findOneAndUpdate({
        _id:req.user._id
      },
      { $pull:
        {
          friends:req.body.userId,
          requested:req.body.userId,
          recieved:req.body.userId
        }
      },
      {upsert: true }).lean()
      .exec(function(err,data){
        if (err) {
                response.success = false;
                response.code = 10901;
                response.userMessage = "There was a problem with the request, please try again."
                return SendResponse(res, 500);
            } else {
              console.log("data",data)
              user.findOneAndUpdate({
                  _id:req.body.userId
                },{
                  $pull:
                  {
                    friends:req.user._id,
                    recieved:req.user._id,
                    requested:req.user._id
                  }
                },
                {upsert: true }).lean()
                .exec(function(err,user){
                  if (err) {
                          response.success = false;
                          response.code = 10901;
                          response.userMessage = "There was a problem with the request, please try again."
                          return SendResponse(res, 500);
                      } else {
                        console.log("--------------")
                                                console.log("--------------")
                        console.log("--------------")
                        console.log("--------------")

                        console.log("user",user)
                        response.success = true
                        response.userMessage = 'request send';
                        response.code = 200;
                        
                        response.errors = null;
                        return SendResponse(res, 200);
                      }
                })
            }
      })
    }
}
methods.acceptreq=function(req,res){
   req.checkBody('userId', 'userId is required.').notEmpty();
    var errors = req.validationErrors(true);
    if (errors) {
      console.log("here-----")
        response.success = false;
        response.code = 10801;
        response.errors = errors;
        response.userMessage = 'Validation errors';
        return SendResponse(res, 400);
    } else {
      user.findOneAndUpdate({
        _id:req.user._id
      },{
        
        $push:{friends:req.body.userId},
        $pull:{requested:req.body.userId,
          recieved:req.body.userId
        }
        },{upsert: true }).lean()
      .exec(function(err,data){
        if (err) {
                response.success = false;
                response.code = 10901;
                response.userMessage = "There was a problem with the request, please try again."
                return SendResponse(res, 500);
            } else {
              user.findOneAndUpdate({
                  _id:req.body.userId
                },{
                  $push:{friends:req.user._id},
                  $pull:
                    {
                      recieved:req.user._id,
                      requested:req.user._id
                    }
                  
                },{upsert: true }).lean()
                .exec(function(err,user){
                  if (err) {
                          response.success = false;
                          response.code = 10901;
                          response.userMessage = "There was a problem with the request, please try again."
                          return SendResponse(res, 500);
                      } else {
                        response.success = true
                        response.userMessage = 'request send';
                        response.code = 200;
                        
                        response.errors = null;
                        return SendResponse(res, 200);
                      }
                })
            }
      })
    }
}
methods.canclereq = function(req,res){
  console.log("=====",req.body)
  req.checkBody('userId', 'userId is required.').notEmpty();
    var errors = req.validationErrors(true);
    if (errors) {
      console.log("here-----")
        response.success = false;
        response.code = 10801;
        response.errors = errors;
        response.userMessage = 'Validation errors';
        return SendResponse(res, 400);
    } else {
      user.findOneAndUpdate({
        _id:req.user._id
      },{
        $pull:{
          requested:req.body.userId,
        recieved:req.body.userId}
      },
      {upsert: true }).lean()
      .exec(function(err,data){
        if (err) {
                response.success = false;
                response.code = 10901;
                response.userMessage = "There was a problem with the request, please try again."
                return SendResponse(res, 500);
            } else {
              user.findOneAndUpdate({
                  _id:req.body.userId
                },{
                  $pull:{recieved:req.user._id,
                  requested:req.user._id}},
                  {upsert: true }).lean()
                .exec(function(err,user){
                  if (err) {
                          response.success = false;
                          response.code = 10901;
                          response.userMessage = "There was a problem with the request, please try again."
                          return SendResponse(res, 500);
                      } else {
                        response.success = true
                        response.userMessage = 'request send';
                        response.code = 200;
                        
                        response.errors = null;
                        return SendResponse(res, 200);
                      }
                })
            }
      })
    }
}
methods.sendrequest=function(req,res){
  req.checkBody('userId', 'userId is required.').notEmpty();

    var errors = req.validationErrors(true);
    if (errors) {
        response.success = false;
        response.code = 10801;
        response.errors = errors;
        response.userMessage = 'Validation errors';
        return SendResponse(res, 400);
    } else {
      user.findOneAndUpdate({
        _id:req.user._id
      },{
        $push:{requested:req.body.userId}
      }).lean()
      .exec(function(err,data){
        if (err) {
                response.success = false;
                response.code = 10901;
                response.userMessage = "There was a problem with the request, please try again."
                return SendResponse(res, 500);
            } else {
              user.findOneAndUpdate({
                  _id:req.body.userId
                },{
                  $push:{recieved:req.user._id}
                }).lean()
                .exec(function(err,user){
                  if (err) {
                          response.success = false;
                          response.code = 10901;
                          response.userMessage = "There was a problem with the request, please try again."
                          return SendResponse(res, 500);
                      } else {
                        response.success = true
                        response.userMessage = 'request send';
                        response.code = 200;
                        
                        response.errors = null;
                        return SendResponse(res, 200);
                      }
                })
            }
      })
    }
}

methods.allUsers=function(req,res){
  console.log("here i am ",req.user)
  user.find({
    _id: {$ne: req.user._id} 
  }).lean()
        .exec(function(err, data) {
            if (err) {
                response.success = false;
                response.code = 10901;
                response.userMessage = "There was a problem with the request, please try again."
                return SendResponse(res, 500);
            } else {
              var friends=[]
              var requested=[]
              var recieved=[]
              var unknown=[]
              for(i=0;i<data.length;i++){
                var found=false
                for(friendsC=0;friendsC<req.user.friends.length;friendsC++){
                  if(data[i]._id.toString()==req.user.friends[friendsC].toString()){
                    friends.push(data[i])
                    found=true;
                    break
                  }
                }
                if(!found){
                  for(friendsC=0;friendsC<req.user.recieved.length;friendsC++){
                    console.log("--------------")
                    console.log("--------------",friendsC)
                    console.log("--------------")
                    console.log("--------------")
                    console.log("--------------")
                    console.log("data[i]._id",data[i]._id)
                    console.log("req.user.recieved[friendsC]",req.user.recieved[friendsC])
                  if(data[i]._id.toString()==req.user.recieved[friendsC].toString()){
                    console.log("inside")
                    recieved.push(data[i])
                    found=true;
                    break
                  }
                }
                if(!found){
                  for(friendsC=0;friendsC<req.user.requested.length;friendsC++){
                   
                  if(data[i]._id.toString()==req.user.requested[friendsC].toString()){
                    requested.push(data[i])
                    found=true;
                    break
                  }
                }
                }
                if(!found){
                  unknown.push(data[i])
                }
              }
            }
            response.data={
              friends:friends,
              requested:requested,
              recieved:recieved,
              unknown:unknown
            }
            response.success = true
          response.userMessage = '';
          response.code = 200;
          response.errors = null;
          return SendResponse(res, 200);
          }
        })
}

methods.getuser=function(req,res){
 response.data = {
    user: req.user
  }
  response.success = true
  response.userMessage = '';
  response.code = 200;
  response.errors = null;
  return SendResponse(res, 200);
}

/*********************
signing up new user
*********************/

methods.signup = function(req, res) {
    console.log(">>>", req.body);

    req.checkBody('name', 'First Name of user is required.').notEmpty();
    req.checkBody('phone', 'Phone Number is required.').notEmpty();
    req.checkBody('password', 'Password is required, and should be between 8 to 80 characters.').notEmpty().len(8, 80);
    req.checkBody('email', 'email is required, and should be between 8 to 80 characters.').notEmpty().isEmail();;

    var errors = req.validationErrors(true);
    if (errors) {
        response.success = false;
        response.code = 10801;
        response.errors = errors;
        response.userMessage = 'Validation errors';
        return SendResponse(res, 400);
    } else {
        my_email = req.param('email').toLowerCase()
        var newuser = new user({
            name: req.param('name'),
            email: my_email,
            phone:req.param('phone')
        });

        newuser.password = req.param('password');
        console.log(newuser, "=======>new")
        newuser.save(function(err, user_data) {
            if (err) {

                console.log(err);
                if (err.code === 11000) {
                    response.success = false;
                    response.code = 10902;
                    response.userMessage = 'Email already registered.';
                    response.errors = {
                        email: {
                            param: 'email',
                            msg: 'Email already registered.',
                            value: req.body.email
                        }
                    };
                    return SendResponse(res, 208);
                } else {                   
                    response.success = false;
                    response.code = 10901;
                    response.userMessage = 'Oops! Our bad! The server slept while doing that, we just poured it with some coffee. Can you please try doing it again?'
                    return SendResponse(res, 500);
                }
            } else {
                var secretKey = uuid.v4();
                jwt_payload = {
                    name: user_data.firstname,
                    id: user_data._id,
                    email: user_data.email
                }
                var token = jwt.sign(jwt_payload, secretKey, {
                    expiresIn: 1140
                })

                var newSession = new Session({
                    user: user_data._id,
                    token: token
                });
                newSession.save(function(err, session) {
                    if (err) {
                        slack.webhook({
                            channel: "#error_res",
                            username: "error track in user.js",
                            text: "err >>>" + err
                        }, function(err, response) {
                            ////console.log(response);
                        });


                        response.success = false;
                        response.code = 10901;
                        response.userMessage = 'Oops! Our bad! The server slept while doing that, we just poured it with some coffee. Can you please try doing it again?'
                        response.data = null;
                        response.errors = null;
                        return SendResponse(res, 500);
                    } else {
                        // mail.sendverification(user_data.email, 'Verfication Code', user_data.unique_code);
                        response.data = {
                            userid: user_data._id,
                            token: session.token,

                        };
                        response.success = true;
                        response.code = 200;
                        return SendResponse(res, 200);

                    }
                });


            }
        });
    }

};

/*********************
    signing up new user ends
*********************/

methods.userLogin = function(req, res, next) {
  console.log("req.body", req.body);
  // NullResponseValue();
  //Check for any errors.
  req.checkBody('email', 'email is required.').notEmpty();
  req.checkBody('password', 'password is required').notEmpty();
  var errors = req.validationErrors(true);
  if (errors) {
    response.error = true;
    response.code = 10801;
    response.errors = errors;
    response.userMessage = 'Validation errors';
    return SendResponse(res, 400);
  } else {
    passport.authenticate('local', function(err, user, info) {

      if (err) {
        if (err == 10901) {
          console.log("error1");
          response.error = true;
          response.code = 10901;
          response.userMessage = 'There was a problem with the request, please try again.'
          response.data = null;
          response.errors = null;
          return SendResponse(res, 500);
        } else {
          response.error = true;
          response.code = 10901;
          response.userMessage = 'Oops! Our bad! The server slept while doing that, we just poured it with some coffee. Can you please try doing it again?'
          response.data = null;
          response.errors = null;
          return SendResponse(res, 400);
        }
      } else {

        if (!user) {
          console.log("!user1");

          response.error = true;
          response.code = 10101; //user Doesn't exists
          response.data = null;
          response.userMessage = 'email id not registerd or incorrect password';
          /*response.errors = {
            user : 'info.message'
          }*/
          return SendResponse(res, 403);

        } else {
          response.error = false;
          response.code = 200;
          response.userMessage = 'Thanks for logging in.';
          response.data = {
            token: info.sessionToken,
            user: {
              email: user.email,
              name: user.firstname + ' ' + user.lastname,
              _id: user._id


            }
          };
          response.errors = null;
          return SendResponse(res, 200);
        }
      }
    })(req, res, next);
  }

}

/*********************
resendValidation Ends
*********************/
methods.userlogout = function(req, res) {
  // NullResponseValue();
  Session.findOneAndRemove({
      user: req.user._id
    })
    .lean()
    .exec(function(err) {
      if (err) {
        response.error = true;
        response.code = 10901;
        response.userMessage = 'There was a problem with the request, please try again.'
        return SendResponse(res, 500);
      } else {
        response.data = null;
        response.error = false;
        response.userMessage = 'user Logged Out successfully';
        response.code = 200;
        response.errors = null;
        return SendResponse(res, 200);
      }
    });
};
/*********************
        userlogout Ends
*********************/


