

import { useEffect, useState } from "react";
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import 'firebase/firestore';
import {useAuthState, useSignInWithGoogle} from "react-firebase-hooks/auth"
import "firebase/auth";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { collection, getDocs, query, getFirestore, QuerySnapshot } from "firebase/firestore";


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

const auth = getAuth(app)
const firestore = getFirestore(app)

function App() {
  const [user,loading, error] = useAuthState(auth)

  return (
    <>
      {user?(
        <>
          <ChatRoom/>
        </>
      ):(
        <SignIn/>
      )}
    </>
  )
}

function SignIn(){
  let [signInWithGoogle, user] = useSignInWithGoogle(auth)
  signInWithGoogle =()=>{
      const provider = new GoogleAuthProvider()
      signInWithPopup(auth, provider)
      
  }
  return(
    <>
      <button onClick={signInWithGoogle}>SIGN IN</button>
    </>
  )
}
function ChatRoom(){
    const [messages, setMessages] = useState([]);

    useEffect(()=>{
      fetchMessages()
    },[]);
    
      
    const fetchMessages = async ()=>{

      const qSnapshot =  await getDocs(collection(firestore, "messages"))
      let messagess = qSnapshot.docs.map((message)=>
      ({...message.data(), id:message.id})
      )
      setMessages(messagess)
    
    }    
    const messages_array=messages.map((message)=>(
      message.message)
    )
    return(
        <>
          <ChatMessages message={messages_array}></ChatMessages>
        </>
      )
    
  
}
function ChatMessages(props){
  console.log("OK")
  return (<>
    <p className="messages"> 
    {props.message}
    </p>
    </>
   )
  
}


export default App
