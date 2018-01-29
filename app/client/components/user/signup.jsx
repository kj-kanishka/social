'use strict';

import React from 'react';
import axios from 'axios';
import * as auth from './../common.jsx'
import { createHashHistory } from 'history'
import { Link } from 'react-router-dom';

const history = createHashHistory()

//Signup component
export default class Signup extends React.Component {
  constructor() {
    super();
    auth.isLoggedIn((data)=>{
      if(data){
        this.props.history.push('/')

      }
    })
    this.state = {
      name: '',
      password: '',
      phone:'',
      email:''
    }
    this.submitSignup = this.submitSignup.bind(this);
  }

 submitSignup(e) {
  console.log("hi i am here",e)
    e.preventDefault();
    const that = this;
    axios.post('/api/user', {
        name: this.state.name,
        email:this.state.email,
        phone:this.state.phone,
        password: this.state.password
    })
    .then( (response)=> {
      console.log("response",response)
      auth.setheader(response.data.data.token)
      
      console.log("here>>",axios.defaults.headers)
                        this.props.history.push('/')

    })
    .catch(function (error) {
      console.log(error);
    });
  }

  render() {
    return (
      <form className="form-style-9">
<ul>
<li>
    <input type="text" name="field1" onChange={(e) => this.setState({name: e.target.value})}  className="field-style field-split align-left" placeholder="Name" />
    <input type="email" name="field2" onChange={(e) => this.setState({email: e.target.value})} className="field-style field-split align-right" placeholder="Email" />

</li>
<li>
    <input type="text" name="field3" onChange={(e) => this.setState({phone: e.target.value})} className="field-style field-split align-left" placeholder="Phone" />
</li>
<li>
<input type="password" name="field3" onChange={(e) => this.setState({password: e.target.value})} className="field-style field-full align-none" placeholder="Password" />
</li>

<li>
<input type="submit" onClick={this.submitSignup} value="Sign Up" />
<font> Already have account? <Link to="/login">Login</Link></font>
</li>
</ul>
</form>
    );
  }
};
