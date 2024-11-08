
import { useEffect, useRef, useState } from "react";
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import 'firebase/firestore';
import { useAuthState, useSignInWithGoogle } from "react-firebase-hooks/auth"
import "firebase/auth";
import { getAuth, GoogleAuthProvider, signInWithPopup, updateCurrentUser, updateProfile } from "firebase/auth";
import { collection, getDocs, query, getFirestore, QuerySnapshot, onSnapshot, orderBy, serverTimestamp, setDoc, doc, addDoc, limit, limitToLast } from "firebase/firestore";


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
  const [user, loading, error] = useAuthState(auth)

  return (
    <>
      {user ? (
        <>
          <SignOut/>
          <ChatRoom />
        </>
      ) : (
        <SignIn />
      )}
    </>
  )
}

function SignIn() {
  let [signInWithGoogle, user] = useSignInWithGoogle(auth)
  signInWithGoogle = () => {
    const provider = new GoogleAuthProvider()
    signInWithPopup(auth, provider)
    
if(auth.currentUser){
  auth.currentUser.providerData.forEach((profile)=>{
    updateProfile(auth.currentUser,{photoURL:profile.photoURL})
  })

}

  }
  return (
    <>
      <button onClick={signInWithGoogle}>SIGN IN</button>
    </>
  )
}
function SignOut(){
  return auth.currentUser && (
    <button onClick={()=>auth.signOut()}>SIGN OUT</button>
  )
}
function ChatRoom() {
  const dummy = useRef()
  const [messages, setMessages] = useState([]);
  const [formValue, setFormValue] = useState('')

  useEffect(() => {
    fetchMessages()
  }, []);

  const scrollToView = ()=>{
    console.log(dummy)
    if(dummy.current){

      dummy.current.scrollIntoView({behavior:'smooth', block:'center'})
    }
    
  }
  const sendMessage = async (e) => {
    e.preventDefault()
    setFormValue('')
    const { uid, photoURL } = auth.currentUser
    await addDoc(collection(firestore, "messages"), {
      message: formValue,
      createdAt: serverTimestamp(),
      uid,
      photoURL
    })
    scrollToView()
    
  }

  const fetchMessages = ()=>{
    const collection_ = collection(firestore, "messages")
    const query_ = query(collection_, orderBy("createdAt"), limitToLast(25))
    onSnapshot(query_, async () => {
      const qSnapshot = await getDocs(query_)
      let messagess = qSnapshot.docs.map((message) =>
        ({ ...message.data(), id: message.id })
      )
      scrollToView()
      setMessages(messagess)

    })

  }
  const messages_array = messages.map((message) => (
    <ChatMessages key={message.id} message={message}></ChatMessages>)
  )
  return (
    <div className="wrapper">
      <div className="messages">
        <div className="message-content">
        {messages_array}
        <div ref={dummy}></div>
        </div>
        <form className="message-input" onSubmit={sendMessage}>
          <input value={formValue} onChange={(e) => { setFormValue(e.target.value) }}></input>
          <button type="onSubmit">SEND</button>
        </form>
      </div>
    </div>
  )


}
function ChatMessages(props) {
  const { message, uid,photoURL } = props.message
  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received'
  return (<>
      <img src={photoURL}></img>
    <div className={`message ${messageClass}`}>
      {message}
    </div>
    <div className="timestamp"></div>
  </>
  )

}


export default App
