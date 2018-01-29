'use strict';

import React from 'react';
import axios from 'axios';
import * as auth from './../common.jsx'

//Login component
export default class Login extends React.Component {
  constructor() {
    auth.isLoggedIn(function(data){
      if(data){
        window.location ='/home'
      }
    })
    super();
    this.state = {
      email: '',
      password: '',
    }
    this.submitLogin = this.submitLogin.bind(this);
  }

  submitLogin(e) {
    e.preventDefault();
    const that = this;
    console.log("this.state.",this.state.password)
    axios.post('/api/user/session', {
        email: this.state.email,
        password: this.state.password
    })
    .then(function (response) {
      console.log("response",response)
      auth.setheader(response.data.data.token)
      
      console.log("here>>",axios.defaults.headers)
        window.location ='/'
    })
    .catch(function (error) {
      console.log(error);
    });
  }

  render() {
    console.log('============>login')
    return (
      <form className="form-style-9">
<ul>
<li>
    <input type="text" name="field1" onChange={(e) => this.setState({email: e.target.value})} className="field-style field-full align-none" placeholder="Email" />

</li>
<li>
      <input type="password" name="field2" onChange={(e) => this.setState({password: e.target.value})} className="field-style field-full align-none" placeholder="password" />

</li>

<li>
<input type="submit" onClick={this.submitLogin} value="Login" />
<font>New User ??  <a href='\signup'>Create an account</a></font>
</li>
</ul>
</form>
    );
  }
};
