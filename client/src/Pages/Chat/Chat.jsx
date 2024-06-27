import React from 'react'
import { useLocation } from 'react-router-dom'
import StudentChat from './StudentChat';
import AdminChat from './AdminChat';

function Chat() {

    const {state} = useLocation() ; 
    //console.log(state);
    const {fullName} = state ; 
    const {role} = state ; 
    //console.log(role);
  return (
    <>
     
     {
        role == 'USER' ? <StudentChat name={fullName}/> : <AdminChat name={fullName}/>
     }
    
    </>
  )
}

export default Chat