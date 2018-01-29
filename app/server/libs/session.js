var mongoose = require('mongoose');
var Session = mongoose.model('Session');
var user = mongoose.model('user');
var session = {};


var response = {
    success: false,
    code: "",
    data: null,
    userMessage: ''
};
var SendResponse = function(res, status) {
    return res.status(status || 200).send(response);
};

/*********************
    Checking for token of loggedin user
*********************/


session.checkToken = function(req, res, next) {

    console.log("session>>>>>>>>>>>>>",req.body);
    var bearerToken;
    var bearerHeader = req.headers["authorization"];
    if (typeof(bearerHeader) !== 'undefined') {
        //console.log("============",bearerHeader);
        var bearer = bearerHeader.split(" ");
        //console.log("============",bearer);
        bearerToken = bearer[1];
        //console.log("bearerToken",bearerToken)
        req.token = bearerToken;
        //bearerToken = bearerToken.slice(1,bearerToken.length).slice(0,-1);
    }
    var token = bearerToken || req.body.token || req.query.token;


    Session
        .findOne({
            token: token
        })
        .populate('user', {
            _id: true,
            email: true,
            name: true,
            phone: true,
            requested:true,
            recieved:true,
            friends:true,
            profilePic:true
          
        })
        .lean()
        .exec(function(err, data) {

            if (err) {

                response.success = false;
                response.code = 10901;
                response.userMessage = "There was a problem with the request, please try again."
                return SendResponse(res, 500);
            } else {

                if (data) { // Horray!! Your session exists.
                    //console.log("@@@@@@@@2",data)
                    req.user = data.user;
                    //console.log("user",req.user);
                    return next();
                } else {
                    response.success = false;
                    response.userMessage = "Your session doesn't exits.";
                    return SendResponse(res, 403);
                }
            }
        });
};

/*********************
    checkToken Ends
*********************/


module.exports = session;