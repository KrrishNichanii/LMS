import React, { useEffect, useState } from 'react'
import HomeLayout from '../../Layouts/HomeLayout'
import { useLocation, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';
import { deleteCourseLecture, getCourseLectures } from '../../Redux/Slices/LectureSlice';

function DisplayLectures() {
    const {state} = useLocation() ; 
    const navigate = useNavigate() ; 
    const dispatch = useDispatch() ; 
    const { lectures } = useSelector(state => state.lecture) ; 
    const { role } = useSelector(state => state.auth) ; 
    const [currentVideo , setCurrentVideo] = useState(0) ; 
    useEffect(() => {
        if(!state){
            navigate('/courses') ; 
        }
         dispatch(getCourseLectures(state._id)) ; 
    },[]) ;

    const onLectureDelete = async (courseId,lectureId) => {
        await dispatch(deleteCourseLecture({courseId,lectureId}))
        await dispatch(getCourseLectures(courseId)) ; 
    }

  return (
    <HomeLayout>
        {/* <div className="flex flex-col gap-10 items-center justify-center min-h-[90vh]  text-white mx-[5%]">
            <div className="text-center  text-4xl font-semibold text-yellow-500 ">
                Course Name: {state?.title}
            </div>
            {
                lectures && lectures.length > 0 ?
                <div className="flex justify-center gap-10 w-full">
                    <div className="space-y-5 w-[40rem] p-2 rounded-lg shadow-[0_0_10px_black]">
                        <video src={lectures && lectures[currentVideo]?.lecture?.secure_url}
                        className='object-fill rounded-tl-lg w-full rounded-tr-lg'
                        controls
                        disablePictureInPicture
                        muted
                        controlsList='nodownload'
                        >
                            
                        </video>
                        <div className="">
                            <h1>
                                <span className='text-yellow-500 '> Title:{" "}
                                </span>
                                {lectures && lectures[currentVideo]?.title}
                            </h1>
                            <p>
                                <span className='text-yellow-500 line-clamp'>
                                    Description: {" "}
                                </span>
                                {lectures && lectures[currentVideo]?.description}
                            </p>
                        </div>
                    </div>

                    <ul className='w-[28rem] p-2 rounded-lg shadow-[0_0_10px_black] space-y-4'>
                        <li className='font-semibold text-xl text-yellow-500 flex items-center justify-between'>
                            <p>
                                Lectures list
                            </p>
                            {role === 'ADMIN' && (
                                <button onClick={() => navigate('/course/addlecture',{state: {...state}})} className='btn btn-primary px-2 py-1 rounded-md font-semibold text-sm'>
                                    Add new lecture
                                </button>
                            )}
                        </li>
                        {
                            lectures && lectures.map((lecture,idx) => {
                                return (
                                    <li key={lecture._id} className='space-y-2'>
                                        <p className='cursor-pointer' onClick={() => setCurrentVideo(idx)}>
                                            <span>
                                                {" "} Lecture {idx+1} : {" "}
                                            </span>
                                            {lecture?.title}
                                        </p>
                                        {role === 'ADMIN' && (
                                            <button onClick={() => onLectureDelete(state?._id,lecture?._id)} className='btn btn-accent px-2 py-1 rounded-md font-semibold text-sm'>
                                                Delete lecture
                                            </button>
                                        )}
                                    </li>
                                )
                            })
                        }
                    </ul>
                </div> : (
                    <div className="text-lg">
                        No lectures uploaded yet
                    </div>
                )

            }
        </div> */}
            <div className="text-center relative  text-4xl top-10 font-semibold text-yellow-500 ">
                {state?.title}
            </div>
        <div className="flex flex-col gap-10 items-center  justify-center min-h-[90vh]  text-white mx-[5%]">
            {
                lectures && lectures.length > 0 ?
                <div className="flex justify-center gap-10 w-full">
                    <div className="space-y-5 w-[65rem] p-2 rounded-lg shadow-[0_0_10px_black]">
                        <video src={lectures && lectures[currentVideo]?.lecture?.secure_url}
                        className='object-fill rounded-tl-lg w-full rounded-tr-lg'
                        controls
                        disablePictureInPicture
                        muted
                        controlsList='nodownload'
                        >
                            
                        </video>
                        <div className=" mt-2  space-y-4">
                            <h1 className='text-xl'>
                                <span className='text-yellow-500 text-2xl font-semibold'> Title:{" "}
                                </span>
                                {lectures && lectures[currentVideo]?.title}
                            </h1>
                            <p className='text-xl'>
                                <span className='text-yellow-500 line-clamp text-2xl font-semibold'>
                                    Description: {" "}
                                </span>
                                {lectures && lectures[currentVideo]?.description}
                            </p>
                        </div>
                    </div>

                    <ul className='w-[30rem] h-[45rem] overflow-y-scroll p-4 rounded-lg shadow-[0_0_10px_black] space-y-8'>
                        <li className='font-semibold text-2xl text-yellow-500 flex items-center justify-between'>
                            <p>
                                Lectures list
                            </p>
                            {role === 'ADMIN' && (
                                <button onClick={() => navigate('/course/addlecture',{state: {...state}})} className='btn btn-primary px-4 py-1 rounded-md font-semibold text-lg'>
                                    Add  lecture
                                </button>
                            )}
                        </li>
                        {
                            lectures && lectures.map((lecture,idx) => {
                                return (
                                    <li key={lecture._id} onClick={() => setCurrentVideo(idx)} className='space-y-4 hover:bg-gray-800 p-4 rounded-lg border border-yellow-500'>
                                        <p className='cursor-pointer text-xl' >
                                            <span>
                                                {" "} Lecture {idx+1} : {" "}
                                            </span>
                                            {lecture?.title}
                                        </p>
                                        {role === 'ADMIN' && (
                                            <button onClick={() => onLectureDelete(state?._id,lecture?._id)} className='btn btn-accent px-2 py-1 rounded-md font-semibold text-lg'>
                                                Delete lecture
                                            </button>
                                        )}
                                    </li>
                                )
                            })
                        }
                    </ul>
                </div> : (
                    <div className="text-lg space-x-5">
                         <span>No lectures uploaded yet</span>
                       { role &&  role == 'ADMIN' && (<button onClick={() => navigate('/course/addlecture',{state: {...state}})} className='btn btn-primary px-4 py-1 rounded-md font-semibold text-lg'>
                            Add  lecture
                        </button>) }
                    </div>
                )

            }
        </div>
    </HomeLayout>
  )
}

export default DisplayLectures