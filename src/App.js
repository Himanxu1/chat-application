import { useEffect, useState } from 'react';
import './App.css';
import io from 'socket.io-client';


let socket;
const CONNECTION_PORT = 'http://localhost:3001/';


function App() {
  //  before logged in
  const [loggedIn,setLoggedIn] = useState(false);
 const [room,setRoom] = useState("");
 const [username,setUserName] = useState("");

//  after logged in
const [message,setMessage] = useState("");
const [messageList,setMessageList] = useState([]);


  useEffect(()=>{
    socket = io(CONNECTION_PORT);
  },[CONNECTION_PORT])

  useEffect(()=>{
    socket.on("recieve-message",(data)=>{
     setMessageList([...messageList,data]);
    })
  })

  const connectToRoom=() =>{
    setLoggedIn(true);
    socket.emit("join-room",room);
  }

  const sendMessage = async()=>{
    let messageContent = {
      room:room,
      content:{
        author: username,
        message: message
      }
    }
   await socket.emit("send-message",messageContent);
    setMessageList([...messageList,messageContent.content])
    setMessage("");

  }
  return (
    <div className="App">
   {!loggedIn ? (
    <div className='log_in'>
      <div  className='inputs'>
        <input  type="text" placeholder='Name.' onChange={(e)=>setUserName(e.target.value)} />
        <input  type="text" placeholder='Room.' onChange={(e)=>setRoom(e.target.value)} />
      </div>
      <button onClick={connectToRoom}>Enter Chat</button>
    </div>
   ):(
    <div className='chat_container'>
      <div className='messages'>
    {messageList.map((val,key)=>{
      return (
        <div div className='message_container'id={val.author == username ? "You":"other"}>
      <div key={key} className="messageIndividual">
        
        {val.author}: {val.message}
        </div>
        </div>
      )
    })}
      </div>
      <div className='message_inputs' >
        <input type="text" placeholder="Enter Message..." value={message} onChange={(e)=>setMessage(e.target.value)}/> 
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
   )}
    </div>
  );
}

export default App;
