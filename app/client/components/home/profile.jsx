'use strict';

import React from 'react';
import axios from 'axios';

import MtSvgLines from 'react-mt-svg-lines';
import * as auth from './../common.jsx'
import Header from '../header.jsx';
//Main component
export default class Profile extends React.Component {
  constructor() {
    super();
    this.state = {
      name:"",
      email: "",
      phone: "",
      profilePic:null,
      temppic:false
    }

    auth.isLoggedIn((data)=>{
      if(!data){
        window.location ='/signup'
      }
      else{
        var link=false
        if(data.profilePic&&data.profilePic.filename){
          link='https://evening-river-88604.herokuapp.com/api/profilepic/'+data.profilePic.filename
        }
        this.setState({
      name:data.name,
      email: data.email,
      phone: data.phone,
      temppic:link
    })
      }
    })

    this.handleChange = this.handleChange.bind(this);
    this.submitData=this.submitData.bind(this)
  }
  handleChange(e){
    console.log("handleChange")
    var file=e.target.files[0]
    
    var reader = new FileReader();
  var url = reader.readAsDataURL(file);

   reader.onloadend = function (e) {
     
      this.setState({profilePic: file,
                     temppic:reader.result
      })
      console.log("this ----",this.state)
    }.bind(this);
  console.log(url)
  }
  submitData(e){
    e.preventDefault();
    console.log("==============",this.state.profilePic)
    const formData = new FormData()
    formData.append('email', this.state.email)
    formData.append('name', this.state.name)
    formData.append('phone', this.state.phone)
    formData.append('profilePic', this.state.profilePic)
    // var arr = this.state.temppic.split(','),
    //     mime = arr[0].match(/:(.*?);/)[1],
    //     bstr = atob(arr[1]),
    //     n = bstr.length,
    //     u8arr = new Uint8Array(n);
    //   while (n--) {
    //     u8arr[n] = bstr.charCodeAt(n);
    //   }
    //   var mycrop = new File([u8arr], 'profilePic', {
    //     type: mime
    //   });
    console.log("formData",formData)
    const config = { headers: { 'Content-Type': 'multipart/form-data' } };

    axios.put('/api/user/',formData,config)
    .then(function (response) {
      console.log("response",response)
    window.location ='/'
    })
    .catch(function (error) {
      console.log(error);
    });
  }
  componentDidUpdate() {
   
    }

  render() {
    var that=this

    return (
      <div>
     <Header/>
    <form className="form-style-9">
<ul>
<li>
{
  function(){
    if(that.state.temppic){
      return (
        <img className="profilepic field-style field-split  align-left" src={that.state.temppic}/>
        )
    }
    else{
      
      return (
        <img className="profilepic field-style field-split  align-left" src="https://evening-river-88604.herokuapp.com/api/profilepic/profile.jpg"/>
        )
    }
  }()
}

    <input type="file" name="profilePic" id="profilePic" className="profilepic field-style field-split  align-right" onChange={this.handleChange } placeholder="Change Picture"/>

</li>
<li>
<lable> Name : </lable>
    <input type="text" name="field1" onChange={(e) => this.setState({name: e.target.value})} value={that.state.name} className="field-style field-full align-none" placeholder="Email" />

</li>
<li>
<lable> Email : </lable>
    <input type="text" name="field2" onChange={(e) => this.setState({email: e.target.value})} value={that.state.email} className="field-style field-full align-none" placeholder="Email" />

</li>

<li>
<lable> Phone : </lable>
    <input type="number" name="field3" onChange={(e) => this.setState({phone: e.target.value})} value={that.state.phone} className="field-style field-full align-none" placeholder="Email" />

</li>
<li>
<input type="submit" onClick={this.submitData} value="Save" />
</li>
</ul>
</form> 
    
</div>
    );
  }
};
