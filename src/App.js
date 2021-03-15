import React, { useState } from 'react';
import './App.css';
import  firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from './firebase.config';

firebase.initializeApp(firebaseConfig);

function App() {
  const [newUser,setNewUser] =useState(false)
  const [user,setUser] =useState({
    inSignedIn : false,
    name : '',
    email : '',
    password: '',
    photo : ''

  })

  const provider = new firebase.auth.GoogleAuthProvider();
  const fbProvider = new firebase.auth.FacebookAuthProvider();
  const  handleSignIn = ()=>{
    firebase.auth().signInWithPopup(provider)
       .then(res => {
      const{displayName,photoURL,email} = res.user;
      const signedInUser ={
        isSignedInUser :true,
        name :displayName,
        email: email,
        photo: photoURL
      }
      setUser (signedInUser);
    })
    .catch (err =>{
      console.log(err);
    })
  }
  
  const handleFbSignIn =() =>{
    firebase
  .auth()
  .signInWithPopup(fbProvider)
  .then((result) => {
    /** @type {firebase.auth.OAuthCredential} */
    var credential = result.credential;

    var user = result.user;
    var accessToken = credential.accessToken;

    // ...
  })
  .catch((error) => {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    // The email of the user's account used.
    var email = error.email;
    // The firebase.auth.AuthCredential type that was used.
    var credential = error.credential;

    // ...
  });
  }

  const handleSignOut =() =>{
    firebase.auth().sigOut()
    .then(res =>{
      const signOutUser ={
        isSignedIn : false,
        name : '',
        email : '',
        photo : '',
        error: '',
        success: false
      }
      setUser(signOutUser);
    })
  }

  const handleBlur = (event) =>{
    
      // console.log(event.target.name,event.target.value);\
      let isFieldValid =true;
      if(event.target.name === 'email'){
           isFieldValid = /\S+@\S+\.\S+/.test(event.target.value);
         
      }
      if(event.target.name === 'password'){
        const isPasswordValid = event.target.value.length>6;
        const passwordHasNumber = /\d{1}/.test(event.target.value);
        isFieldValid =isPasswordValid && passwordHasNumber;
      }
        if(isFieldValid){
          const newUserInfo ={...user};
          newUserInfo [event.target.name] = event.target.value; 
          setUser (newUserInfo);
        }
  }
  const handleSubmit = (event) =>{
    // console.log(user.email, user.password)
  if(newUser && user.email && user.password){  firebase.auth().createUserWithEmailAndPassword(user.email, user.password)
  .then(res => {
    // Signed in 
   const newUserInfo ={...user};
   newUserInfo.error ='';
   newUserInfo.success = true;
   setUser(newUserInfo);
   updateUserName(user.name);
    // ...
  })
  .catch((error) => {
    const newUserInfo ={...user};
    newUserInfo.error = error.message;
    newUserInfo.success = false;
    setUser(newUserInfo);
   
    // ..
  });
      }
      if(!newUser && user.email && user.password){
        firebase.auth().signInWithEmailAndPassword(user.email, user.password)
  .then(res => {
    // Signed in
    const newUserInfo ={...user};
    newUserInfo.error ='';
    newUserInfo.success = true;
    setUser(newUserInfo)
    // ...
  })
  .catch((error) => {
    const newUserInfo ={...user};
    newUserInfo.error = error.message;
    newUserInfo.success = false;
    setUser(newUserInfo);
  });
      }
      event.preventDefault();
  }

  const  updateUserName = name =>{
    const user = firebase.auth().currentUser;

user.updateProfile({
  displayName:name,
  // photoURL: "https://example.com/jane-q-user/profile.jpg"

}).then(function() {
  // Update successful.
}).catch(function(error) {
  // An error happened.
});
  }
   
  return (
    <div className ="App" >
     
        {
          user.isSignedIn ?  <button onClick={handleSignOut}>sign out</button> :
          <button onClick={handleSignIn}>sign in</button>
        }
        <br/>

        <button onClick ={handleFbSignIn}>facebook log in</button>
        {
          user.isSignedIn && <div>
            <p>welcome,{user.name}</p>
            <p>mail:{user.email}</p>
            <img src={user.photo} alt=""/>
          </div>
        }
      <h1>our own auth</h1>
      <input type="checkbox" onChange={() => setNewUser(!newUser)} name="newUser" id=""/>
      <label htmlFor="newUser">new user sign up</label>
     <form onSubmit = {handleSubmit}>
      {newUser && <input name ="name" type="text" onBlur ={handleBlur} placeholder ="your Name"  required/>}
          <br/>
     <input type="text" name ="email" onBlur ={handleBlur} placeholder ="mail address" required/>
      <br/>
      <input type="password" name="password" onBlur ={handleBlur} placeholder="password" required />
      <br/>
     <input type="submit" value={newUser ? 'sign up' : 'sign in'}/>
     </form>
     <p style ={{color : "red"}}>{user.error}</p>
     {user.success && <p style ={{color : "green"}}>user {newUser ? 'created': 'logged in'} successfully</p>}
    </div>
  );
  };

export default App;
