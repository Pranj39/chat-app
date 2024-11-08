import { useState } from 'react'
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import 'firebase/firestore';
import {useAuthState, useSignInWithGoogle} from "react-firebase-hooks/auth"
import 'firebase/auth';
import { collection, query } from 'firebase/firestore/lite';

const firebaseConfig = {

  apiKey: "AIzaSyDWWAN7mBT1ZutfgnY0UmgG0QDb_s7nGmc",

  authDomain: "chat-app-2efc8.firebaseapp.com",

  projectId: "chat-app-2efc8",

  storageBucket: "chat-app-2efc8.firebasestorage.app",

  messagingSenderId: "963731003094",

  appId: "1:963731003094:web:03d61b9999e18ea7bb5b77",

  measurementId: "G-RFXNM4YSL6"

};


// Initialize Firebase

const app = initializeApp(firebaseConfig);

const analytics = getAnalytics(app);

auth = getAuth(app)
firestore = getFirestore(app)
[user,loading, error] = useAuthState(auth)

function App() {

  return (
    <>
      user?(
        <>
          <ChatRoom/>
        </>
      ):(
        <SignIn/>
      )
    </>
  )
}

function SignIn(){
  [signInWithGoogle, user] = useSignInWithGoogle(auth)
  signInWithGoogle =()=>{
      const provider = new GoogleAuthProvider()
      signInWithPopup(auth, provider)
      
  }
  return(
    <>
      <button onClick={signInWithGoogle()}>SIGN IN</button>
    </>
  )
}

function ChatRoom(){
  messagesRef = collection(firestore,'messages')
  messages = query(messagesRef,)
  


  return (
    <>
      <ChatMessages messages={messages}/>
    </>
  )
}

export default App
