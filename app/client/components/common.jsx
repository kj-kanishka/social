'use strict';

import React from 'react';
import axios from 'axios';
import Cookies from 'universal-cookie';
import 
{
    browserHistory
} from 'react-router'

const cookies = new Cookies();

let all={}
all.user={}

all.isLoggedIn=function (cb) {
	let token=cookies.get('mycookie')
	if(token){
		axios.defaults.headers.common['Authorization'] = 'bearer '+token;
		console.log("axios.defaults.headers.common",axios.defaults.headers.common)
		axios.get('/api/ping')
	    .then(function (response) {
	    	console.log("hi here i am ")
	      console.log("response",response)
	      if(response.data.data.user){
	      	console.log("user found",response.data.data.user)
	      	all.user=response.data.data.user
	      	console.log("all.user",all.user)
	      	return cb(all.user)
	      }
	      else{
	      	console.log("user not found")
	      	return cb(false)
	      }
	    })
	    .catch(function (error) {
	      console.log(error);
	      return cb(false)
	    });
	}
	else{
		return cb(false)
	}
}


all.logout=function(){
	console.log("i am in logout")
	axios.delete('/api/user/session')
	    .then(function (response) {
	    	browserHistory.push('/signup')
	    	// window.location ='/signup'
	    })
	    .catch(function (error) {
	      console.log(error);
	    });
}
all.setheader=function(token){
	axios.defaults.headers.common['Authorization'] = 'bearer '+token;
	cookies.set('mycookie', token);

	console.log("done",cookies.get('mycookie'))
}


module.exports = all
