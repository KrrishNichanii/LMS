import React,{useState,useRef , useEffect} from 'react'
import { FaImage, FaPaperPlane } from 'react-icons/fa6';
import { useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
import './style.css'
import { FaTimesCircle } from "react-icons/fa";

const StudentChat = ({name}) => {

const socketRef = useRef(null);
const [adminId, setAdminId] = useState(null);
const [messages, setMessages] = useState([]);
const [input, setInput] = useState('');
const [image, setImage] = useState(null);
const [waiting, setWaiting] = useState(true);
const [adminName, setAdminName] = useState("");
const navigate = useNavigate() ; 

useEffect(() => {
  if (!socketRef.current) {
    socketRef.current = io('http://localhost:3001', {
      reconnection: false, // Prevents automatic reconnection
    });

    socketRef.current.on('connect', () => {
      socketRef.current.emit('registerStudent', name);
    });

    socketRef.current.on('connect_error', () => {
      if(socketRef.current.active) console.log('Hii');
      console.error('Connection error, please check the server.');
      alert('Cannot connect to the server. Please try again later.');
      socketRef.current.disconnect() ; 
      navigate('/');
    });

    socketRef.current.connect();


    socketRef.current.on('adminConnected', ({ id, adminName }) => {
      setAdminId(id);
      setMessages([{senderId: id ,message: 'How may I help you ? '}]);
      setAdminName(adminName);
      setWaiting(false);
    });

    socketRef.current.on('message', ({ senderId, message }) => {
      setMessages(prev => [...prev, { senderId, message }]);
      console.log('Message from admin ', message);
    });

    socketRef.current.on('receiveImageMessage', ({ senderId, image, message }) => {
      setMessages(prev => [...prev, { senderId, image, message }]);
    });

    socketRef.current.on('receiveImage', ({ senderId, image }) => {
      setMessages(prev => [...prev, { senderId, image }]);
    });

    socketRef.current.on('receiveMessage', ({ senderId, message }) => {
      setMessages(prev => [...prev, { senderId, message }]);
    });

    socketRef.current.on('Disconnecting', () => {
        setMessages(prev => [...prev, { message: 'Admin has disconnected', end: true }]);
    });
  }

  return () => {
    if (socketRef.current) {
      socketRef.current.off('waitForAdmin');
      socketRef.current.off('adminConnected');
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
    socketRef.current.emit('sendImageMessage', { recipientId: adminId, image: image, message: input });
    setMessages(prev => [...prev, { senderId: 'me', message: input, image: image }]);
    setImage(null);
    setInput('');
  } else if (image) {
    socketRef.current.emit('image', { recipientId: adminId, image: image });
    setMessages(prev => [...prev, { senderId: 'me', image: image }]);
    setImage(null);
  } else if (input.trim()) {
    console.log('S ',input);
    socketRef.current.emit('message', { recipientId: adminId, message: input });
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
  socketRef.current.emit('Disconnecting', { recipientId: adminId });
  // Wait a moment to ensure the server receives the message
  setTimeout(() => {
    if (socketRef.current) {
      socketRef.current.disconnect();
      console.log('Manually disconnected from the server');
      socketRef.current = null;
    }
  }, 200);
  setWaiting(true) ; 
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


  return (
    <div className="flex items-center justify-center">

        <div className='mt-10 w-[60%] h-[40rem]'>

        <h1 className='text-4xl mb-6 text-white text-center'>Student Chat</h1>
         <div className="h-[40rem] w-full">
        {
            waiting  ? (<div className="h-[90%]  flex items-center justify-center">
                
                <div className="w-[50%]  flex gap-5">
                    <p className='text-4xl text-white'>Waiting for an Admin </p>
                    <button className='btn btn-primary text-xl text-white' onClick={() =>{
                        handleDisconnect() ; 
                        navigate('/') ; 
                    } }>Go back</button>
                </div>
                     
                
                </div> ) : (<div className='w-full'>
                        <div>

                                    <h1 className='text-3xl text-white'>Admin - {adminName} </h1>
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

export default StudentChat;