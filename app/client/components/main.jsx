'use strict';

import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Home from './home/home.jsx';
import Login from './user/login.jsx';
import Signup from './user/signup.jsx';
import Profile from './home/profile.jsx';

export default () => {
  return (
    <section>
      <Switch>
        <Route exact path='/' component={Home}/>
        <Route exact path='/friends' component={Home}/>
        <Route path='/signup' component={Signup}/>
        <Route path='/login' component={Login}/>
        <Route path='/profile' component={Profile}/>
      </Switch>
    </section>
  );
}
