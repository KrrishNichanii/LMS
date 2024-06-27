import React, { useEffect, useState } from 'react'
import HomeLayout from '../../Layouts/HomeLayout'
import { useLocation, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';
import { deleteCommentFromLecture, deleteCourseLecture, getCourseLectures ,addCommentToLecture } from '../../Redux/Slices/LectureSlice';
import { FaCommentAlt } from "react-icons/fa";
import { FaTrash } from "react-icons/fa";

function DisplayLectures() {
    const {state} = useLocation() ; 
    const navigate = useNavigate() ; 
    const dispatch = useDispatch() ; 
    
    const {lectures} = useSelector(state => state.lecture) ; 
    const { role } = useSelector(state => state.auth) ; 
    const [currentVideo , setCurrentVideo] = useState(0) ; 
    const { fullName } = useSelector(state => state.auth.data)
    //console.log('Com ',lectures[currentVideo]?.lecture?.comments);
    const courseId = state?._id ; 
    const [comment,setComment] = useState("") ; 
    console.log('Lectures fetched ',lectures);
    useEffect(() => {
        if(!state){
            navigate('/courses') ; 
        }
         dispatch(getCourseLectures(state?._id)) ; 
    },[]) ;

    const onLectureDelete = async (courseId,lectureId) => {
        await dispatch(deleteCourseLecture({courseId,lectureId}))
        await dispatch(getCourseLectures(courseId)) ; 
    }



    const addComment = async (e) => {
        e.preventDefault();
        await dispatch(addCommentToLecture({ courseId, lectureId: lectures[currentVideo]._id, user: fullName, text: comment }));
        setComment("");
    }

    function formatCommentDate(dateString) {
        const date = new Date(dateString);
      
        // Options for formatting the date
        const options = {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: 'numeric',
          minute: 'numeric',
          hour12: true,
        };
      
        // Format the date
        return date.toLocaleString('en-US', options);
      }
    
    const deleteComment = async  (commentId) => {
       let lectureId = lectures[currentVideo]._id ; 
       
       await dispatch(deleteCommentFromLecture({lectureId,commentId,courseId})) ; 
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
            <div className="text-center relative  text-4xl top-5 font-semibold text-yellow-500 ">
                {state?.title}
            </div>
        <div className="flex flex-col mb-20 gap-10 items-center  justify-center min-h-[90vh]  text-white mx-[5%]">
            {
                lectures && lectures.length > 0 ?
                <div className="flex justify-center gap-10 w-full">
                    <div className="space-y-5 h-[50rem] w-[65rem] p-2 rounded-lg shadow-[0_0_10px_black] overflow-y-scroll">
                        <video src={lectures && lectures[currentVideo]?.lecture?.secure_url}
                        className='object-fill rounded-tl-lg w-full rounded-tr-lg'
                        controls
                        disablePictureInPicture
                        muted
                        controlsList='nodownload'
                        >
                            
                        </video>
                        <div className=" mt-2  space-y-4">
                            <h1 className='text-xl px-3'>
                                <span className='text-yellow-500 text-2xl font-semibold'> Title:{" "}
                                </span>
                                {lectures && lectures[currentVideo]?.title}
                            </h1>
                            <p className='text-xl px-3'>
                                <span className='text-yellow-500 line-clamp text-2xl font-semibold'>
                                    Description: {" "}
                                </span>
                                {lectures && lectures[currentVideo]?.description}
                            </p>

                            <div className="mt-5 p-3">
                                <div className="flex gap-3 items-center">
                                    <h2 className='text-3xl font-semibold'>Comments</h2>
                                    <span className='text-3xl'>{lectures[currentVideo]?.lecture?.comments?.length}</span>
                                </div>
                                <form onSubmit={addComment} className='flex my-2 items-center'>
                                    <input
                                     type="text"
                                     placeholder='Add Comment...'
                                     className='w-full my-2 h-[3rem] text-xl p-2 bg-transparent border border-gray-600 rounded-tl-md rounded-bl-md'
                                     value = {comment}
                                     onChange={(e) => setComment(e.target.value)}
                                    />
                                    <button
                                     type='submit' 
                                     className='border border-gray-600 rounded-tr-md rounded-br-md h-[3rem]  border-l-0 w-[3rem] hover:bg-yellow-600 transition-all ease-in-out duration-500'> <FaCommentAlt className='m-auto'/> </button>
                                </form>
                                <ul className='space-y-5'>
                                    {
                                        lectures[currentVideo]?.lecture?.comments.map((comment,idx) => (
                                            <li key={idx} className='shadow-[0_0_5px_black] p-3 space-y-2 rounded-md'>
                                                 <div className="flex justify-between">
                                                    <span className='text-2xl font-semibold'>{comment.user}</span>
                                                    <span>{formatCommentDate(comment.date)}</span>
                                                 </div>
                                                 <div className="flex justify-between group">
                                                 <p className=''>{comment.text}</p>
                                                  { (role == 'ADMIN' ||fullName == comment.user) && <button onClick={() => deleteComment(comment._id)} className='opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-red-600 text-xl h-[2rem] p-2 rounded-md flex items-center'><FaTrash className='text-xl'/></button>}
                                                 </div>
                                            </li>
                                        ))
                                    }
                                </ul>
                            </div>
                        </div>
                    </div>

                    <ul className='w-[30rem] h-[50rem] overflow-y-scroll p-4 rounded-lg shadow-[0_0_10px_black] space-y-8'>
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