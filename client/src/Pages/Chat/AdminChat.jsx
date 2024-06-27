import React, { useEffect , useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
import { FaPaperPlane } from "react-icons/fa6";
import { FaImage } from "react-icons/fa6";
import { FaTimesCircle } from 'react-icons/fa';

const Admin = ({name}) => {
  const socketRef = useRef(null);
  const [studentId, setStudentId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [image, setImage] = useState(null);
  const [waiting, setWaiting] = useState(true);
  const [studentName, setStudentName] = useState("");
  const navigate = useNavigate() ; 

  useEffect(() => {
    if (!socketRef.current) {
      socketRef.current = io('http://localhost:3001', {
        autoConnect: false, // Prevents automatic reconnection
      });

      socketRef.current.on('connect', () => {
        socketRef.current.emit('registerAdmin', name);
      });

      socketRef.current.on('connect_error', () => {
        console.error('Connection error, please check the server.');
        alert('Cannot connect to the server. Please try again later.');
        navigate('/');
      });

      socketRef.current.connect();

      socketRef.current.on('studentConnected', ({ id, studentName }) => {
        setStudentId(id);
        setMessages([]);
        setStudentName(studentName);
        setWaiting(false);
      });

      socketRef.current.on('message', ({ senderId, message }) => {
        setMessages(prev => [...prev, { senderId, message }]);
        console.log('Message from student ', message);
      });

      socketRef.current.on('receiveImageMessage', ({ senderId, image, message }) => {
        setMessages(prev => [...prev, { senderId, image, message }]);
      });

      socketRef.current.on('receiveImage', ({ senderId, image }) => {
        setMessages(prev => [...prev, { senderId, image }]);
      });

      socketRef.current.on('receiveMessage', ({ senderId, message }) => {
        setMessages(prev => [...prev, { senderId, message }]);
        console.log('M ',message);
      });

      socketRef.current.on('Disconnecting', () => {
        setMessages(prev => [...prev, { message: 'Student has disconnected', end:true }]);
        setStudentName("") ; 
      });
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.off('studentConnected');
        socketRef.current.off('message');
        socketRef.current.off('receiveImage');
        socketRef.current.off('receiveImageMessage');
        socketRef.current.off('receiveMessage');
        socketRef.current.off('Disconnecting');
      }
    };
  }, []);

  const sendMessage = () => {
    if (image && input) {
      socketRef.current.emit('sendImageMessage', { recipientId: studentId, image: image, message: input });
      console.log('Image ',image);
      setMessages(prev => [...prev, { senderId: 'me', message: input, image: image }]);
      setImage(null);
      setInput('');
    } else if (image) {
      socketRef.current.emit('image', { recipientId: studentId, image: image });
      setMessages(prev => [...prev, { senderId: 'me', image: image }]);
      setImage(null);
    } else if (input.trim()) {
      socketRef.current.emit('message', { recipientId: studentId, message: input });
      setMessages(prev => [...prev, { senderId: 'me', message: input }]);
      setInput("");
    }
  };

  const handleImage = (event) => {
    const file = event.target.files[0];

    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64Image = e.target.result;
        setImage(base64Image);
      };
      reader.readAsDataURL(file);
    }
  }

  const handleDisconnect = () => {
    if (socketRef.current) {
      socketRef.current.emit('Disconnecting', { recipientId: studentId });
      setTimeout(() => {
        socketRef.current.disconnect();
        console.log('Manually disconnected from the server');
        socketRef.current = null;
      }, 100);
    }
    navigate('/') ;
  }

  const [isOpen, setIsOpen] = useState(false);

const openModal = () => setIsOpen(true);
const closeModal = () => setIsOpen(false);

useEffect(() => {
  if (isOpen) {
    const handleClickOutside = (event) => {
      if (event.target.classList.contains('modal-overlay')) {
        closeModal();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }
}, [isOpen])

  console.log('Waiting ',waiting);
  return (
    <div className="flex items-center justify-center">

        <div className='mt-10 w-[60%] h-[40rem]'>

        <h1 className='text-4xl mb-6 text-white text-center'>Admin Chat</h1>
         <div className="h-[40rem] w-full">
        {
            waiting  ? (<div className="h-[90%]  flex items-center justify-center">
                
                <div className="w-[50%]  flex gap-5">
                    <p className='text-4xl text-white'>Waiting for a student </p>
                    <button className='btn btn-primary text-xl text-white' onClick={() =>{
                        handleDisconnect() ; 
                        navigate('/') ; 
                    } }>Go back</button>
                </div>
                     
                
                </div> ) : (<div className='w-full'>
                        <div>

                                    <h1 className='text-3xl text-white'>Student - {studentName} </h1>
                                    <div className="border border-white p-4 rounded-lg mt-5 h-[50rem] overflow-y-scroll">
                            {
                                messages.map((msg,idx) => {
                                    if(msg.end){
                                        return (
                                            <div className="text-red-400 text-left">{msg.message}</div>
                                        )
                                    
                                    }
                                    else 
                                        return (
                                        <div key={idx} className={msg.senderId === 'me' ? 'text-yellow-500 text-right text-xl mb-2' : 'text-white text-xl mb-2'}>
                                             <div className="bg-gray-300 inline-block px-4 py-2 rounded-lg bg-opacity-20">
                                             {  msg.image &&(
                                                    <>
                                                    <img src={msg.image} onClick={openModal} className=' w-[20rem] h-[20rem] my-2'/>
                                                                       {isOpen && (
                                                                        <div className="fixed inset-0 m-auto bg-black bg-opacity-50 w-[100vw] h-[100vh] flex justify-center items-center">
                                                                          <div className="modal-content w-[50%] h-[70%] relative bg-white p-4">
                                                                            <button
                                                                              className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded"
                                                                              onClick={closeModal}
                                                                            >
                                                                              <FaTimesCircle/>
                                                                            </button>
                                                                            <img src={msg.image} className='w-full h-full' />
                                                                          </div>
                                                                        </div>
                                                                      )}
                                                    </>
                                            )} 
                                                {msg.message && (<p className='opacity-100'>{msg.message}</p>)}
                                             </div>
                                        </div>
                                        )
                                    
                                })
                            }


                                    </div>

                        </div>
                        <div className="flex justify-between w-full mt-2">
                            <div className="w-[60%] flex items-center">
                                <div className=" flex items-center w-full">
                                <input value={input} className='bg-transparent w-[90%] border border-r-0 p-2 text-[1.35rem] rounded-tl-md rounded-bl-md' placeholder='Enter message' onChange={(e) => setInput(e.target.value)} />
                                <button className='rounded-tr-md rounded-br-md rounded-none bg-green-400 p-[1rem] text-[1.35rem]' onClick={sendMessage}><FaPaperPlane className='text-[1.35rem] text-black'/></button>
                                </div>
                                <input type="file" name='image' id='image'  className='hidden mr-5' onChange={handleImage} />
                                <label htmlFor="image" className='mr-2'><FaImage className='text-5xl text-yellow-500'/></label>
                            </div>
                        <button onClick={handleDisconnect} className='btn btn-error'>Disconnect</button>
                        </div>
                            </div>)
        }
         </div>
        
        </div>

    </div>
  );
};

export default Admin;
