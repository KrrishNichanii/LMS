import React, { useEffect, useState } from 'react'
import HomeLayout from '../../Layouts/HomeLayout'
import { useLocation, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import { addCourseLecture } from '../../Redux/Slices/LectureSlice';
import { AiOutlineArrowLeft } from 'react-icons/ai';

function AddLecture() {
    const courseDetails = useLocation().state ; 
    const dispatch = useDispatch() ; 
    const navigate = useNavigate() ; 

    const [userInput,setUserInput] = useState({
        id: courseDetails?._id , 
        lecture: undefined , 
        title: "",
        description:"",
        videoSrc:"",
    })
  

    const handleInputChange = (e) => {
        const {name , value} =e.target ; 

        setUserInput({
            ...userInput,
            [name]:value , 
        })
    }

    const handleVideo = (e) => {
        const video = e.target.files[0] ; 
        const source = window.URL.createObjectURL(video) ;
        //console.log('Source ',source);

        setUserInput({
            ...userInput,
            lecture: video , 
            videoSrc:source,
        })
    }


    const onFormSubmit = async (e) => {
        e.preventDefault() ; 

        if(!userInput.lecture || !userInput.title || !userInput.description){
            toast.error('All fields are mandatory') ;
            return ;
        }
        console.log('Test');
        const response = await dispatch(addCourseLecture(userInput)) ; 
        if(response?.payload?.success){
            setUserInput({
                id: courseDetails?._id , 
                lecture: undefined , 
                title: "",
                description:"",
                videoSrc:"",
            })
            navigate(-1) ; 
        }
    }

    useEffect(() => {
        if(!courseDetails){
            navigate('/courses') ; 
        }
    },[])

  return (
    <HomeLayout>
         <div className="min-h-[90vh] text-white flex flex-col items-center justify-center gap-10 mx-16">
            <div className="flex flex-col gap-5 p-4 shadow-[0_0_10px_black] w-[32rem] rounded-lg h-[38rem]">
                <header className='flex items-center justify-center relative'>
                    <button onClick={() => navigate(-1)} className='absolute left-2 text-xl text-green-500'>
                        <AiOutlineArrowLeft className='border border-transparent hover:border-green-500 transition-all ease-in-out duration-500 p-2 hover: rounded-full w-[2.5rem] h-[2.5rem]'/>
                    </button>
                    <h1 className='text-3xl text-yellow-500 font-semibold'>Add new lecture</h1>
                </header>
                <form onSubmit={onFormSubmit}
                 className='flex flex-col gap-6'
                >
                   <input
                    type="text"
                     name='title'
                     placeholder='Enter title'
                     onChange={handleInputChange}
                     className='bg-transparent px-3 py-1 h-[3rem] text-xl border rounded-md'
                     value={userInput.title}
                    />

                   <textarea
                     name='description'
                     placeholder='Enter description'
                     onChange={handleInputChange}
                     className='bg-transparent px-3 py-1 rounded-md text-xl border resize-none overflow-y-scroll h-36'
                     value={userInput.description}
                    />

                    {
                        userInput?.videoSrc ? (
                            <video
                            muted
                            src={userInput?.videoSrc}
                            controls
                            controlsList='nodownload nofullscreen'
                            disablePictureInPicture
                            className='object-fill rounded-md w-full'
                            >

                            </video>

                        ) :  (
                            <div className="h-48 border flex items-center justify-center cursor-pointer">
                                <label className='font-semibold text-xl cursor-pointer rounded-md' htmlFor='lecture'>Choose your video</label>
                                <input type="file" className='hidden' id='lecture' name='lecture' onChange={handleVideo} accept='video/mp4,video/x-mp4 ,video/*' />
                            </div>
                        )
                    }
                    <button type='submit' className='btn btn-primary py-1 font-semibold text-xl'>Add new lecture</button>
                </form>
            </div>
         </div>
    </HomeLayout>
  )
}

export default AddLecture