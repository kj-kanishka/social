'use strict';

import React from 'react';
import axios from 'axios';

import MtSvgLines from 'react-mt-svg-lines';
import * as auth from './../common.jsx'
import Header from '../header.jsx';
//Main component

import { createHashHistory } from 'history'
const history = createHashHistory()

export default class Home extends React.Component {
  constructor(props) {
    super(props);
    
    this.state={
        friends:[],
        requested:[],
        recieved:[],
        unknown:[],
        onlyfriends:false,
        search:"",
        req:[],
        rec:[],
        un:[],
        fri:[]
      }
      console.log("this",this)
      

      var that=this
      

    auth.isLoggedIn((data)=>{
      if(!data){
                this.props.history.push('/signup')

        // browserHistory.push('/signup')
        // window.location ='/signup'
      }
      else{
        that.loadData()
      }
    })
        

  }
  componentDidUpdate() {
    // console.log("pathname",this.props.location.pathname)
    // console.log("this.state.onlyfriends",this.state.onlyfriends)
    if(this.props.location.pathname=="/friends"&&this.state.onlyfriends==false){
        this.setState({onlyfriends:true})
      }
      else
        if(this.props.location.pathname!="/friends"&&this.state.onlyfriends==true){
        this.setState({onlyfriends:false})
      }
console.log("search",this.state.search)

// var res = str.match(/ain/g);

    }
loadData(){
  var state={}
  axios.get('/api/user')
    .then( (response)=> {
      
      this.setState({
        req:response.data.data.requested,
        rec:response.data.data.recieved,
        un:response.data.data.unknown,
        fri:response.data.data.friends,
        friends:response.data.data.friends,
        requested:response.data.data.requested,
        recieved:response.data.data.recieved,
        unknown:response.data.data.unknown
      })
      
    })
    .catch(function (error) {
    });
}
canclereq(data){
axios.put('/api/addfriends', {
        userId: data._id     
    })
    .then( (response) =>{
      var requested=this.state.requested
      var unknown=this.state.unknown
      var recieved=this.state.recieved
      var found=false
      for(var i=0;i<unknown.length;i++){
        
        if(unknown[i]._id.toString()==data._id.toString()){
          found=true
          break
        }
      }
      if(!found){

      unknown.push(data)
    }
      var foundid=false
      for(var i=0;i<requested.length;i++){
        if(requested[i]._id==data._id)
        {
          requested.splice(i,1)
          foundid=true
          break
        }
      }
      if(!foundid){
        for(var i=0;i<recieved.length;i++){
        if(recieved[i]._id==data._id)
        {
          recieved.splice(i,1)
          foundid=true
          break
        }
      }
      }
      this.setState({
        req:requested,
rec:recieved,
un:unknown,
        requested:requested,
        unknown:unknown,
        recieved:recieved
      })
    })
    .catch(function (error) {
    });
}
unfriend(data){
   axios.put('/api/friends', {
        userId: data._id,        
    })
    .then( (response) =>{
      var friends=this.state.friends
      var unknown=this.state.unknown
      var found=false
      for(var i=0;i<unknown.length;i++){
        
        if(unknown[i]._id.toString()==data._id.toString()){
          found=true
          break
        }
      }
      if(!found){

      unknown.push(data)
    }
      for(var i=0;i<friends.length;i++){
        if(friends[i]._id==data._id)
        {
          friends.splice(i,1)
          break
        }
      }
      this.setState({
        fri:friends,
        un:unknown,
        friends:friends,
        unknown:unknown
      })
    })
    .catch(function (error) {
    });
}
acceptreq(data){
  
  axios.post('/api/friends', {
        userId: data._id,
        
    })
    .then( (response) =>{
      var friends=this.state.friends
      var recieved=this.state.recieved
      var found=false
      for(var i=0;i<friends.length;i++){
        
        if(friends[i]._id.toString()==data._id.toString()){

          found=true
          break
        }
      }
      if(!found){

      friends.push(data)
    }
      for(var i=0;i<recieved.length;i++){
        if(recieved[i]._id==data._id)
        {
          recieved.splice(i,1)
          break
        }
      }
      this.setState({
        rec:recieved,
        fri:friends,
        recieved:recieved,
        friends:friends
      })
    })
    .catch(function (error) {
    });
}
 addfriend(data){

  axios.post('/api/addfriends', {
        userId: data._id,
        
    })
    .then( (response) =>{
      var requested=this.state.requested
      var unknown=this.state.unknown
      var found=false
      for(var i=0;i<requested.length;i++){
        
        if(requested[i]._id.toString()==data._id.toString()){
          found=true
          break
        }
      }
      if(!found){

      requested.push(data)
    }
      for(var i=0;i<unknown.length;i++){
        if(unknown[i]._id==data._id)
        {
          unknown.splice(i,1)
          break
        }
      }
      this.setState({
        req:requested,
        un:unknown,
        requested:requested,
        unknown:unknown
      })
    })
    .catch(function (error) {
    });
 }
handlesearch(evet){
  var value=evet.target.value.toLowerCase()
  console.log("value",value)
  if(value){
var friends=[],
requested=[],
recieved=[],
unknown=[]
for(var a=0;a<this.state.unknown.length;a++){
  console.log("a",unknown[a])
  var name=this.state.unknown[a].name.toLowerCase()
  console.log("name",name)
  var email=this.state.unknown[a].email.toLowerCase()
  console.log("email",email)
  if(name.startsWith(value)||email.startsWith(value)){
    unknown.push(this.state.unknown[a])
  }
}
for(var b=0;b<this.state.friends.length;b++){
  var name=this.state.friends[b].name.toLowerCase()
  var email=this.state.friends[b].email.toLowerCase()
  if(name.startsWith(value)||email.startsWith(value)){
    friends.push(this.state.friends[b])
  }
}
for(var c=0;c<this.state.requested.length;c++){
  var name=this.state.requested[c].name.toLowerCase()
  var email=this.state.requested[c].email.toLowerCase()
  if(name.startsWith(value)||email.startsWith(value)){
    requested.push(this.state.requested[c])
  }
}
for(var d=0;d<this.state.recieved.length;d++){
  var name=this.state.recieved[d].name.toLowerCase()
  var email=this.state.recieved[d].email.toLowerCase()
  if(name.startsWith(value)||email.startsWith(value)){
    recieved.push(this.state.recieved[d])
  }
}
this.setState({
  unknown:unknown,
  requested:requested,
  recieved:recieved,
  friends:friends
})
}
else{
  this.setState({
    requested:this.state.req,
    recieved:this.state.rec,
    friends:this.state.fri,
    unknown:this.state.un
  })
}

}
 
  render() {
    var that=this
    return (
      <div>
     <Header/>
     <div className="search">
      <input type="text" className="searchTerm" onChange={this.handlesearch.bind(this)} placeholder="Enter a Name or email Id"/>
   </div>
     <div >
     {
      this.state.friends.map(function(data){
       return (<div className="mycards">
        {
          function(){
        var link=false
        if(data.profilePic&&data.profilePic.filename){
        link= 'https://evening-river-88604.herokuapp.com/api/profilepic/'+data.profilePic.filename
    }
        
          
            if(link){
              return (
                <img className="dp " src={link}/>
                )
            }
            else{
              return(
              <img className="dp " src="https://evening-river-88604.herokuapp.com/api/profilepic/profile.jpg"/>
            )
            }
          }()
          
        }
  <div className="container">
    <h4><b>{data.name}</b></h4> 
    <p>{data.email}<br/>
    {data.phone}</p> 
  </div>
  <button className="unfriend" type="submit" onClick={that.unfriend.bind(that,data)} >Unfriend </button>

  </div>

)
      })
     }
     </div>
     {
      function(){
        if(!that.state.onlyfriends)
          return ( <div>
     <div >
     {
      that.state.requested.map(function(data){
       return (<div className="mycards">
          {
          function(){
        var link=false
        if(data.profilePic&&data.profilePic.filename){
        link= 'https://evening-river-88604.herokuapp.com/api/profilepic/'+data.profilePic.filename
    
        }
            if(link){
              return (
                <img className="dp " src={link}/>
                )
            }
            else{
              return(
              <img className="dp " src="https://evening-river-88604.herokuapp.com/api/profilepic/profile.jpg"/>
              )
            }
          }()
          
        }
  <div className="container">
    <h4><b>{data.name}</b></h4> 
    <p>{data.email}<br/>
    {data.phone}</p> 
  </div>
  <button className="canclereq" type="submit" onClick={that.canclereq.bind(that,data)} >Cancle request </button>
  </div>
)

      })
     }
     </div>
     

     <div >
     {
      that.state.recieved.map(function(data){
        return (<div className="mycards">
          {
          function(){
        var link=false
        if(data.profilePic&&data.profilePic.filename){
        link= 'https://evening-river-88604.herokuapp.com/api/profilepic/'+data.profilePic.filename
    }
        
            if(link){
              return (
                <img className="dp " src={link}/>
                )
            }
            else{
              return(
              <img className="dp " src="https://evening-river-88604.herokuapp.com/api/profilepic/profile.jpg"/>
           )
            }
          }()
          
        }
  <div className="container">
    <h4><b>{data.name}</b></h4> 
    <p>{data.email}<br/>
    {data.phone}</p> 
  </div>
    <button className="acceptreq" type="submit" onClick={that.acceptreq.bind(that,data)} >Accept </button>
  <button className="canclereq" type="submit" onClick={that.canclereq.bind(that,data)} >Cancle request </button>

</div>)

      })
     }
     </div>


     <div >
     {
      that.state.unknown.map(function(data){
        var link=false
        if(data.profilePic&&data.profilePic.filename){
        link= 'https://evening-river-88604.herokuapp.com/api/profilepic/'+data.profilePic.filename
    }
        return (<div className="mycards">
          {
          function(){
            if(link){
              return (
                <img className="dp " src={link}/>
                )
            }
            else{
              return(
              <img className="dp " src="https://evening-river-88604.herokuapp.com/api/profilepic/profile.jpg"/>
            )
            }
          }()
          
        }
  <div className="container">
    <h4><b>{data.name}</b></h4> 
    <p>{data.email}<br/>
    {data.phone}</p> 
  </div>
  <button className="addfriend" type="submit" onClick={that.addfriend.bind(that,data)} >Add Friend </button>
</div>)

      })
     }
     </div>
     </div>
     )
      }()
     }
</div>
    );
  }
};
